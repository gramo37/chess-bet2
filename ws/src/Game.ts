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
  private player1TimeLeft: number;
  private player2TimeLeft: number;
  public isFriendly: boolean;
  public stake: string;

  private timer1: any;
  private timer2: any;

  constructor(
    player1: Player,
    player2: Player,
    isFriendly: boolean = false,
    stake: string,
    gameId?: string,
    status?: TGameStatus
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
    this.player1TimeLeft = INITIAL_TIME;
    this.player2TimeLeft = INITIAL_TIME;
    this.isFriendly = isFriendly;
    this.stake = stake;
  }

  getPlayer1() {
    return this.player1;
  }

  getPlayer2() {
    return this.player2;
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

  async makeMove(socket: WebSocket, move: TMove) {
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
    if (chess.isGameOver()) {
      const winner =
        this.player1.getPlayer() === socket ? this.player1 : this.player2;
      const loser =
        this.player1.getPlayer() === socket ? this.player2 : this.player1;
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
      await db.game.update({
        data: {
          status: COMPLETED,
          result,
          gameOutCome: result === DRAW ? DRAW : CHECKMATE,
          board: this.board,
          endTime: new Date(Date.now()),
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
          blackPlayer: {
            connect: {
              id: this.player2.getPlayerId(),
            },
          },
        },
      });
      // this.gameId = db_game.id;
      this.status = IN_PROGRESS;
      console.log(
        "Sending message to player1 ->",
        this.getPlayer1().getPlayerName()
      );
      sendMessage(this.player1.getPlayer(), {
        type: GAMESTARTED,
        payload: {
          color: this.gameId ? this.player1.getPlayerColor() : WHITE,
          opponent: {
            name: this.getPlayer2().getPlayerName(),
          },
          player: {
            name: this.getPlayer1().getPlayerName(),
          },
          player1TimeLeft: this.player1TimeLeft,
          player2TimeLeft: this.player2TimeLeft,
        },
      });

      console.log(
        "Sending message to player2 ->",
        this.getPlayer2().getPlayerName()
      );
      sendMessage(this.player2.getPlayer(), {
        type: GAMESTARTED,
        payload: {
          color: this.gameId ? this.player2.getPlayerColor() : BLACK,
          opponent: {
            name: this.getPlayer1().getPlayerName(),
          },
          player: {
            name: this.getPlayer2().getPlayerName(),
          },
          player1TimeLeft: this.player1TimeLeft,
          player2TimeLeft: this.player2TimeLeft,
        },
      });

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
          name: this.getPlayer2().getPlayerName(),
        },
        player: {
          name: this.getPlayer1().getPlayerName(),
        },
        player1TimeLeft: this.player1TimeLeft,
        player2TimeLeft: this.player2TimeLeft,
      },
    });

    console.log(
      "Sending message to player1 ->",
      this.getPlayer2().getPlayerName()
    );
    sendMessage(this.player2.getPlayer(), {
      type: GAMERESTARTED,
      payload: {
        board: this.board,
        moves: this.moves,
        color: this.gameId ? this.player2.getPlayerColor() : BLACK,
        sans: this.sans,
        opponent: {
          name: this.getPlayer1().getPlayerName(),
        },
        player: {
          name: this.getPlayer2().getPlayerName(),
        },
        player1TimeLeft: this.player1TimeLeft,
        player2TimeLeft: this.player2TimeLeft,
      },
    });
    this.startPlayer1Timer();
  }

  async endGame(socket: WebSocket | null, payload: TEndGamePayload) {
    const winner =
      this.player1.getPlayer() === socket ? this.player2 : this.player1;
    const loser =
      this.player1.getPlayer() === socket ? this.player1 : this.player2;
    let result: "WHITE_WINS" | "BLACK_WINS" | "DRAW" = sendGameOverMessage(
      winner,
      loser,
      payload.status
    );
    if (payload.status === ACCEPT_DRAW) result = DRAW;
    if (result) {
      console.log(`Game is ended. Result: ${result}.`);
      const areBalancesUpdated = await this.updateBalances(winner, loser);
      await db.game.update({
        data: {
          status: COMPLETED,
          result,
          gameOutCome: payload.status,
          board: this.board,
          endTime: new Date(Date.now()),
          areBalancesUpdated
        },
        where: {
          id: this.gameId,
        },
      });
      this.status = COMPLETED;
      this.stopPlayer1Timer();
      this.stopPlayer2Timer();
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

  async updateBalances(winner: Player, loser: Player) {
    try {
      // Reduce stake amount (this.stake) from loser's account
      // if(!this.stake || !Number.isNaN(Number(this.stake))) return false;
      console.log("Updating balances");
      console.log(
        `Decrementing for Player ->`,
        loser.getPlayerName(),
        loser.getPlayerId()
      );
      console.log(
        `Incrementing for Player ->`,
        winner.getPlayerName(),
        winner.getPlayerId()
      );
      await db.$transaction([
        db.user.update({
          where: {
            id: loser.getPlayerId(),
          },
          data: {
            balance: {
              decrement: Number(this.stake),
            },
            rating: {
              decrement: 10,
            },
          },
        }),
        // Increase 85 % of the stake amount (this.stake) from winner's account
        db.user.update({
          where: {
            id: winner.getPlayerId(),
          },
          data: {
            balance: {
              increment: 0.85 * Number(this.stake),
            },
            rating: {
              increment: 10,
            },
          },
        }),
      ]);
      return true;
    } catch (error) {
      console.log("Error updating balance for ", this.gameId, error);
      return false;
    }
  }
}
