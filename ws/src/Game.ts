import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { Player } from "./Player";
import { broadCastMessage, isCloseTo, sendMessage } from "./utils";
import {
  GAMEOVER,
  GAMESTARTED,
  INVALID_MOVE,
  MOVESUCCESS,
  WHITE,
  BLACK,
  IN_PROGRESS,
  NOT_YET_STARTED,
  GAMERESTARTED,
  COMPLETED,
  DRAW,
  CHECKMATE,
  ACCEPT_DRAW,
  INITIAL_TIME,
  GET_TIME,
  ABANDON,
  ABONDON_TIME,
} from "./constants";
import { db } from "./db";
import { randomUUID } from "crypto";
import { TGameStatus, TMove } from "./types/game.types";
import { TEndGamePayload } from "./types";
import { sendGameOverMessage } from "./utils/game";
import { addMoveToRedis } from "./utils/redis";
import axios from "axios";

export class Game {
  private player1: Player;
  private player2: Player;
  private board: string;
  private moves: TMove[];
  private sans: String[];
  private moveCount: number;
  private startTime: Date;
  private gameId: string;
  private status: TGameStatus;
  private chess: Chess;
  public player1TimeLeft: number;
  public player2TimeLeft: number;
  public isFriendly: boolean;
  public stake: string;
  public gameTime: number;
  public isVirtual = false;

  private timer1: any;
  private timer2: any;

  constructor(
    player1: Player,
    player2: Player,
    isFriendly: boolean = false,
    stake: string,
    gameId?: string,
    status?: TGameStatus,
    gameTime?: number,
    isVirtual?: boolean
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.moves = [];
    this.sans = [];
    this.moveCount = 0;
    this.startTime = new Date();
    this.gameId = gameId ?? randomUUID();
    this.status = status ?? NOT_YET_STARTED;
    this.chess = new Chess();
    this.player1TimeLeft =
      !gameTime || Number.isNaN(gameTime) ? INITIAL_TIME : gameTime;
    this.player2TimeLeft =
      !gameTime || Number.isNaN(gameTime) ? INITIAL_TIME : gameTime;
    this.isFriendly = isFriendly;
    this.stake = stake;
    this.gameTime =
      !gameTime || Number.isNaN(gameTime) ? INITIAL_TIME : gameTime;
    this.isVirtual = isVirtual ? isVirtual : this.isVirtual;
  }

  getPlayer1() {
    return this.player1;
  }

  getPlayer2() {
    return this.player2;
  }

  isAiGame() {
    return this.isVirtual && !this.isFriendly;
  }

  getGameId() {
    return this.gameId;
  }

  getGameStatus() {
    return this.status;
  }

  setPlayer1(player: Player) {
    this.player1 = player;
  }

  setPlayer2(player: Player) {
    this.player2 = player;
  }

  setMoves(moves: TMove[]) {
    this.moves = moves;
    this.moveCount = moves?.length;
  }

  setSans(sans: String[]) {
    this.sans = sans;
  }

  setboard(board: string) {
    this.board = board;
    this.chess = new Chess(board);
  }

  startPlayer1Timer() {
    // Start reducing player1 TimeLeft by 1 every sec
    this.timer1 = setInterval(() => {
      this.player1TimeLeft -= 1;
      if (this.player1TimeLeft <= this.gameTime - ABONDON_TIME) {
        // If player has not made any moves for past 30 sec
        // end the game with status "ABONDENDED"
        if (this.moves.length === 0) {
          if (this.status !== COMPLETED)
            this.endGame(this.player1.getPlayer(), { status: "ABANDON" });
          clearInterval(this.timer1);
        }
      }
      if (this.player1TimeLeft <= 0) {
        if (this.status !== COMPLETED)
          this.endGame(this.player1.getPlayer(), { status: "TIMER_EXPIRED" });
        clearInterval(this.timer1);
      }
    }, 1000);
  }

  startPlayer2Timer() {
    // Start reducing player2 TimeLeft by 1 every sec
    this.timer2 = setInterval(() => {
      this.player2TimeLeft -= 1;
      if (this.player2TimeLeft <= this.gameTime - ABONDON_TIME) {
        // If player has not made any moves for past 30 sec
        // end the game with status "ABONDENDED"
        if (this.moves.length === 1) {
          if (this.status !== COMPLETED)
            this.endGame(this.player1.getPlayer(), { status: "ABANDON" });
          clearInterval(this.timer2);
        }
      }
      if (this.player2TimeLeft <= 0) {
        if (this.status !== COMPLETED)
          this.endGame(this.player2.getPlayer(), { status: "TIMER_EXPIRED" });
        clearInterval(this.timer2);
      }
    }, 1000);
  }

  stopPlayer1Timer() {
    // Stop reducing player1 TimeLeft by 1 every sec
    clearInterval(this.timer1);
  }

  stopPlayer2Timer() {
    // Stop reducing player2 TimeLeft by 1 every sec
    clearInterval(this.timer2);
  }

  getPlayer1TimeLeft() {
    return this.player1TimeLeft;
  }

  getPlayer2TimeLeft() {
    return this.player2TimeLeft;
  }

  getBoard() {
    return this.board;
  }
  async makeMove(socket: WebSocket | null, move: TMove) {
    const player1 = this.player1.getPlayer();
    const player2 = this.player2.getPlayer();
    // Validate the move
    // 1: Player1 is making the move when moveCount is even and vice versa
    if (this.moveCount % 2 === 0 && socket === player2) {
      sendMessage(socket, {
        type: INVALID_MOVE,
        payload: {
          message: "Please wait for your turn!",
        },
      });
      return;
    }

    if (this.moveCount % 2 === 1 && socket === player1) {
      sendMessage(socket, {
        type: INVALID_MOVE,
        payload: {
          message: "Please wait for your turn!",
        },
      });
      return;
    }

    // 2: The move is valid according to chess rules
    const chess = this.chess;
    let san = "";
    try {
      const { san: _san } = chess.move(move);
      san = _san;
    } catch (e) {
      console.log(e);
      sendMessage(socket, {
        type: INVALID_MOVE,
        payload: {
          message: e,
        },
      });
      return;
    }

    // Make the move
    this.moves.push(move);
    this.sans.push(san);
    this.board = chess.fen();

    // Update the move in DB
    // Add the move to redis
    try {
      await addMoveToRedis({
        gameId: this.gameId,
        moveNumber: this.moveCount + 1,
        from: move.from,
        to: move.to,
        san,
        promotion: move.promotion,
        player1TimeLeft: this.player1TimeLeft,
        player2TimeLeft: this.player2TimeLeft,
      });
    } catch (error) {
      console.log(error);
    }

    if (chess.turn() === "w") {
      // Black has made a move, stop player2Timer and start player1Timer
      this.startPlayer1Timer();
      this.stopPlayer2Timer();
    } else {
      this.startPlayer2Timer();
      this.stopPlayer1Timer();
    }

    broadCastMessage([player1, player2], {
      type: MOVESUCCESS,
      payload: {
        board: this.board,
        moves: this.moves,
        sans: this.sans,
        player1TimeLeft: this.player1TimeLeft,
        player2TimeLeft: this.player2TimeLeft,
      },
    });

    // Check for draw or checkmate
    let result: "WHITE_WINS" | "BLACK_WINS" | "DRAW" | null = null;
    const winner =
      this.player1.getPlayer() === socket ? this.player1 : this.player2;
    const loser =
      this.player1.getPlayer() === socket ? this.player2 : this.player1;
    if (chess.isGameOver()) {
      result = sendGameOverMessage(winner, loser, CHECKMATE);
      this.stopPlayer1Timer();
      this.stopPlayer2Timer();
    }

    if (chess.isDraw() || chess.isThreefoldRepetition()) {
      broadCastMessage([player1, player2], {
        type: GAMEOVER,
        payload: {
          winner: null,
          loser: null,
          status: COMPLETED,
          result: DRAW,
        },
      });
      result = DRAW;
      this.stopPlayer1Timer();
      this.stopPlayer2Timer();
    }

    // Update the result of game in DB
    if (result) {
      let areBalancesUpdated = false;
      if (result !== "DRAW")
        areBalancesUpdated = await this.updateBalances(winner, loser);
      else areBalancesUpdated = true;
      await db.game.update({
        data: {
          status: COMPLETED,
          result,
          gameOutCome: result === DRAW ? DRAW : CHECKMATE,
          board: this.board,
          endTime: new Date(Date.now()),
          areBalancesUpdated,
        },
        where: {
          id: this.gameId,
        },
      });
      this.status = COMPLETED;
      return;
    }

    this.moveCount += 1;
  }

  async createGame() {
    const isAiGame = this.player2.isAIOpponent();
    if (this.status === NOT_YET_STARTED) {
      const db_game = await db.game.create({
        data: {
          status: IN_PROGRESS,
          stake: this.stake,
          isFriendly: this.isFriendly,
          id: this.gameId,
          whitePlayer: {
            connect: {
              id: this.player1.getPlayerId(),
            },
          },
          // Only connect blackPlayer if not an AI game
          blackPlayer: isAiGame
            ? {}
            : {
                connect: {
                  id: this.player2.getPlayerId(),
                },
              },
          isVirtual: this.isVirtual,
        },
      });

      // this.gameId = db_game.id;
      this.status = IN_PROGRESS;

      sendMessage(this.player1.getPlayer(), {
        type: GAMESTARTED,
        payload: {
          color: this.gameId ? this.player1.getPlayerColor() : WHITE,
          opponent: {
            name: await this.getPlayer2().getPlayerUserName(),
            rating: this.getPlayer2().getPlayerRating(),
          },
          player: {
            name: await this.getPlayer1().getPlayerUserName(),
            rating: this.getPlayer1().getPlayerRating(),
          },
          player1TimeLeft: this.player1TimeLeft,
          player2TimeLeft: this.player2TimeLeft,
        },
      });

      console.log(
        "Sending message to player2 ->",
        this.getPlayer2().getPlayerName()
      );
      if (!isAiGame || !this.player2.getPlayer()) {
        sendMessage(this.player2.getPlayer(), {
          type: GAMESTARTED,
          payload: {
            color: this.gameId ? this.player2.getPlayerColor() : BLACK,
            opponent: {
              name: await this.getPlayer1().getPlayerUserName(),
              rating: this.getPlayer1().getPlayerRating(),
            },
            player: {
              name: await this.getPlayer2().getPlayerUserName(),
              rating: this.getPlayer2().getPlayerRating(),
            },
            player1TimeLeft: this.player1TimeLeft,
            player2TimeLeft: this.player2TimeLeft,
          },
        });
      }

      this.startPlayer1Timer();
      return;
    }
    // Recreating a game that is already present in db
    console.log(
      "Sending message to player1 ->",
      this.getPlayer1().getPlayerName()
    );
    sendMessage(this.player1.getPlayer(), {
      type: GAMERESTARTED,
      payload: {
        board: this.board,
        moves: this.moves,
        color: this.gameId ? this.player1.getPlayerColor() : WHITE,
        sans: this.sans,
        opponent: {
          name: await this.getPlayer2().getPlayerUserName(),
          rating: this.getPlayer2().getPlayerRating(),
        },
        player: {
          name: await this.getPlayer1().getPlayerUserName(),
          rating: this.getPlayer1().getPlayerRating(),
        },
        player1TimeLeft: this.player1TimeLeft,
        player2TimeLeft: this.player2TimeLeft,
      },
    });

    console.log(
      "Sending message to player1 ->",
      this.getPlayer2().getPlayerName()
    );
    if (!isAiGame || !this.player2.getPlayer()) {
      sendMessage(this.player2.getPlayer(), {
        type: GAMERESTARTED,
        payload: {
          board: this.board,
          moves: this.moves,
          color: this.gameId ? this.player2.getPlayerColor() : BLACK,
          sans: this.sans,
          opponent: {
            name: await this.getPlayer1().getPlayerUserName(),
            rating: this.getPlayer1().getPlayerRating(),
          },
          player: {
            name: await this.getPlayer2().getPlayerUserName(),
            rating: this.getPlayer2().getPlayerRating(),
          },
          player1TimeLeft: this.player1TimeLeft,
          player2TimeLeft: this.player2TimeLeft,
        },
      });
    }
    // this.startPlayer1Timer();
  }

  async endGame(
    socket: WebSocket | null,
    payload: TEndGamePayload
  ): Promise<void> {
    try {
      // Determine winner and loser based on the socket
      const winner =
        this.player1.getPlayer() === socket ? this.player2 : this.player1;
      const loser =
        this.player1.getPlayer() === socket ? this.player1 : this.player2;

      // Determine game result
      let result: "WHITE_WINS" | "BLACK_WINS" | "DRAW" = sendGameOverMessage(
        winner,
        loser,
        payload.status
      );
      console.log(
        "winner " + winner.getPlayerName(),
        "loser " + loser.getPlayerName()
      );
      if (payload.status === ACCEPT_DRAW || payload.status === ABANDON) {
        result = "DRAW";
      }

      console.log(`Game is ending. Result: ${result}.`);

      // Update balances only if the result is not a draw
      let areBalancesUpdated = true;
      if (result !== "DRAW") {
        areBalancesUpdated = await this.updateBalances(winner, loser);
      }

      // Update game data in the database
      await db.game.update({
        data: {
          status: COMPLETED,
          result,
          gameOutCome: payload.status,
          board: this.board,
          endTime: new Date(),
          areBalancesUpdated,
        },
        where: { id: this.gameId },
      });

      // Finalize game state
      this.status = COMPLETED;
      this.stopPlayer1Timer();
      this.stopPlayer2Timer();

      console.log("Game has been successfully ended.");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  }

  async sendTimeStatus() {
    try {
      sendMessage(this.player1.getPlayer(), {
        type: GET_TIME,
        payload: {
          player1TimeLeft: this.player1TimeLeft,
          player2TimeLeft: this.player2TimeLeft,
        },
      });
      sendMessage(this.player2.getPlayer(), {
        type: GET_TIME,
        payload: {
          player1TimeLeft: this.player1TimeLeft,
          player2TimeLeft: this.player2TimeLeft,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  matchRating(rating: number) {
    const playerRating = this.getPlayer1().getPlayerRating();
    return isCloseTo(playerRating, rating);
  }

  async updateBalances(winner: Player, loser: Player): Promise<boolean> {
    try {
      // Ensure stake is a valid number
      const stakeAmount = Number(this.stake);
      if (!stakeAmount || isNaN(stakeAmount)) {
        console.error("Invalid stake amount:", this.stake);
        return false;
      }

      console.log("Updating balances for game:", this.gameId);
      console.log(
        `Decrementing for Player -> ${loser.getPlayerName()} (${loser.getPlayerId()}), Rating -> ${loser.getPlayerRating()}`
      );
      console.log(
        `Incrementing for Player -> ${winner.getPlayerName()} (${winner.getPlayerId()}), Rating -> ${winner.getPlayerRating()}`
      );

      const transactions = [];

      if (this.isVirtual) {
        if (loser.getPlayer()) {
          transactions.push(
            db.user.update({
              where: { id: loser.getPlayerId() },
              data: {
                virtualBalance: { decrement: stakeAmount },
                rating: { decrement: 10 },
              },
            })
          );
        }

        if (winner.getPlayer()) {
          transactions.push(
            db.user.update({
              where: { id: winner.getPlayerId() },
              data: {
                virtualBalance: { increment: 0.85 * stakeAmount },
                rating: { increment: 10 },
              },
            })
          );
        }
      } else {
        if (loser.getPlayer()) {
          transactions.push(
            db.user.update({
              where: { id: loser.getPlayerId() },
              data: {
                balance: { decrement: stakeAmount },
                rating: { decrement: 10 },
              },
            })
          );
        }
        if (winner.getPlayer()) {
          transactions.push(
            db.user.update({
              where: { id: winner.getPlayerId() },
              data: {
                balance: { increment: 0.85 * stakeAmount },
                rating: { increment: 10 },
              },
            })
          );
        }
      }

      if (transactions.length > 0) {
        await db.$transaction(transactions);
        console.log("Balances updated successfully for game:", this.gameId);
        return true;
      } else {
        console.error("No transactions to process.");
        return false;
      }
    } catch (error) {
      console.error("Error updating balances for game:", this.gameId, error);
      return false;
    }
  }

  async makeAiMove() {
    if (
      this.chess.isGameOver() &&
      this.isAiGame() &&
      this.chess.turn() === "b"
    ) {
      console.log("Game is over. No moves can be made.");
      return;
    }

    // Evaluate moves and pick the best one
    const StockFishMove = await this.getStockFishMove();
    const bestMove = StockFishMove ? StockFishMove : this.getRandomMove();
    if (bestMove) {
      // this.chess.move(bestMove);
      console.log("move", bestMove);
      this.makeMove(this.player2.getPlayer(), bestMove);
      return bestMove;
    }
    return null;
  }

  private getRandomMove() {
    let computerMove;

    const moves = this.chess.moves({ verbose: true });
    if (moves.length > 0) {
      computerMove = moves[Math.floor(Math.random() * moves.length)];
    }
    console.log("Random Move", computerMove);
    return computerMove;
  }
  async getStockFishMove() {
    try {
      const StockFish_API = `https://stockfish.online/api/s/v2.php?fen=${this.board}&depth=2`;
      const response = await axios.get(StockFish_API);
      const data = await response.data;
      console.log(data);
      return data.bestmove;
    } catch (e) {
      console.log("Error Fetch StockFishMove", e);
      return null;
    }
  }
}
