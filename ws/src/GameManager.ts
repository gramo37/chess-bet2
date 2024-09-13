import { WebSocket } from "ws";
import {
  GAMENOTFOUND,
  INIT_GAME,
  MOVE,
  BLACK,
  WHITE,
  IN_PROGRESS,
  ENDGAME,
  OFFER_DRAW,
  REJECT_DRAW,
  ABORT_GAME,
  GAMEABORTED,
  GET_TIME,
  NOT_YET_STARTED,
  GETFRIENDLYMATCHID,
  SEND_MESSAGE,
} from "./constants";
import { Game } from "./Game";
import { Player } from "./Player";
import { sendMessage } from "./utils";
import { extractUser } from "./auth";
import { db } from "./db";
import { TMove } from "./types/game.types";
import { TEndGamePayload } from "./types";
import { seedBoard } from "./utils/game";

export class GameManager {
  private games: Game[];
  private users: Player[];

  constructor() {
    this.games = [];
    this.users = [];
  }

  async addUser(data: {
    socket: WebSocket;
    token: string;
    type: string;
    stake: string;
    gameId?: string | null;
  }) {
    this.addHandlers(data);
  }

  async getUsers() {
    return this.users;
  }

  addHandlers(data: {
    socket: WebSocket;
    token: string;
    type: string;
    stake: string;
    gameId?: string | null;
  }) {
    const self = this;
    const { socket, token, type, stake, gameId } = data;
    socket.on("message", async function connection(data) {
      const message = JSON.parse(data.toString());
      switch (message?.type) {
        case INIT_GAME:
          await self.initGame(socket, token, stake, type, gameId);
          break;
        case MOVE:
          await self.makeMove(socket, message.move);
          break;
        case ENDGAME:
          await self.endGame(socket, message.payload);
          break;
        case OFFER_DRAW:
          await self.offerDraw(socket);
          break;
        case REJECT_DRAW:
          await self.rejectDraw(socket);
          break;
        case ABORT_GAME:
          await self.abortGame(socket, token);
          break;
        case GET_TIME:
          await self.getTime(socket, token);
          break;
        case SEND_MESSAGE:
          self.SendMessage(socket, token, message.payload.message);
          break;
        default:
          break;
      }
    });
  }

  async SendMessage(socket: WebSocket, token: string, message: string) {
    const user = await extractUser(token);
    if (!user || !user.name || !user.id) return;
    const game = this.games.find(
      (game) =>
        (game.getPlayer1().getPlayer() === socket ||
          game.getPlayer2().getPlayer() === socket) &&
        game.getGameStatus() === IN_PROGRESS
    );
    if (game) {
      const opponent =
        game.getPlayer1().getPlayer() === socket
          ? game.getPlayer2()
          : game.getPlayer1();

      sendMessage(opponent.getPlayer(), {
        type: SEND_MESSAGE,
        payload: {
          message: message,
        },
      });
    } else
      sendMessage(socket, {
        type: GAMENOTFOUND,
      });
  }

  async abortGame(socket: WebSocket, token: string) {
    const user = await extractUser(token);
    if (!user || !user.name || !user.id) return;
    // Find the user's game from this.games
    const game = this.games.find((game) => {
      const player1Id = game.getPlayer1().getPlayerId();
      const player2Id = game.getPlayer2().getPlayerId();
      return player1Id === user.id || player2Id === user.id;
    });
    // Before deleting it check if the game is started or not
    if (!game) return;
    if (game.getGameStatus() === NOT_YET_STARTED) {
      // if not started Delete it
      this.games = this.games.filter(
        (gm) => gm.getGameId() !== game.getGameId()
      );
      sendMessage(socket, {
        type: GAMEABORTED,
      });
    }
    // if (this.pendingUser === null) return;
    // // If the pending user is the player who wants to abort the game
    // if (this.pendingUser.getPlayerId() === user.id) {
    //   this.pendingUser = null;
    //   sendMessage(socket, {
    //     type: GAMEABORTED,
    //   });
    // }
  }

  async getTime(socket: WebSocket, token: string) {
    const user = await extractUser(token);
    if (!user || !user.name || !user.id) return;
    const game = this.games.find(
      (game) =>
        (game.getPlayer1().getPlayer() === socket ||
          game.getPlayer2().getPlayer() === socket) &&
        game.getGameStatus() === IN_PROGRESS
    );
    if (game) {
      await game.sendTimeStatus();
    } else
      sendMessage(socket, {
        type: GAMENOTFOUND,
      });
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user.getPlayerSocket() !== socket);
  }

  async offerDraw(socket: WebSocket) {
    const game = this.games.find(
      (game) =>
        (game.getPlayer1().getPlayer() === socket ||
          game.getPlayer2().getPlayer() === socket) &&
        game.getGameStatus() === IN_PROGRESS
    );
    if (game) {
      const opponent =
        game.getPlayer1().getPlayer() === socket
          ? game.getPlayer2()
          : game.getPlayer1();
      sendMessage(opponent.getPlayer(), {
        type: OFFER_DRAW,
      });
    } else
      sendMessage(socket, {
        type: GAMENOTFOUND,
      });
  }

  async rejectDraw(socket: WebSocket) {
    const game = this.games.find(
      (game) =>
        (game.getPlayer1().getPlayer() === socket ||
          game.getPlayer2().getPlayer() === socket) &&
        game.getGameStatus() === IN_PROGRESS
    );
    if (game) {
      // Send Message to the opponent socket
      const opponent =
        game.getPlayer1().getPlayer() === socket
          ? game.getPlayer2()
          : game.getPlayer1();
      sendMessage(opponent.getPlayer(), {
        type: REJECT_DRAW,
      });
    } else
      sendMessage(socket, {
        type: GAMENOTFOUND,
      });
  }

  async endGame(socket: WebSocket, payload: TEndGamePayload) {
    const game = this.games.find(
      (game) =>
        (game.getPlayer1().getPlayer() === socket ||
          game.getPlayer2().getPlayer() === socket) &&
        game.getGameStatus() === IN_PROGRESS
    );
    if (game) {
      await game.endGame(socket, payload);
    } else
      sendMessage(socket, {
        type: GAMENOTFOUND,
      });
  }

  async initGame(
    socket: WebSocket,
    token: string,
    stake: string,
    type?: string | null,
    gameId?: string | null
  ) {
    const user = await extractUser(token);
    if (!user || !user.name || !user.id) return;
    // Check for pending games in db for the player
    // if a game is already present for the player we will restart that game
    let db_game = await db.game.findFirst({
      where: {
        OR: [{ blackPlayerId: user.id }, { whitePlayerId: user.id }],
        status: IN_PROGRESS,
      },
    });
    if (db_game) {
      console.log("Game is present in DB, recreating it");
      // Check for the game locally
      const game = this.games.find((item) => item.getGameId() === db_game?.id);
      if (game) {
        console.log("Game found locally -> ", game.getGameId());
        const restartedPlayer =
          game.getPlayer1().getPlayerId() === user.id
            ? game.getPlayer1()
            : game.getPlayer2();
        restartedPlayer.setPlayerSocket(socket);
        await game.createGame();
        return;
      }
      return;
    }

    if (type === "friend") {
      // In this case don't check for ratings
      console.log("Creating a friendly match", gameId);
      if (Boolean(gameId)) {
        console.log("Starting the game", gameId, Boolean(gameId));
        // Start the game
        const game = this.games.find((item) => item.getGameId() === gameId);
        const player1 = game?.getPlayer1();
        // Avoid creating game between the same player.
        if (player1?.getPlayerId() !== user.id) {
          const player2 = game?.getPlayer2();
          player2?.setPlayerToken(token);
          player2?.setPlayerSocket(socket);
          player2?.setPlayerId(user.id);
          player2?.setPlayerName(user.name);
          player2?.setPlayerRating(user.rating);
          await game?.createGame();
        }
      } else {
        // Create the game and send this to the frontend
        // and wait for the friend
        const player1 = new Player(
          socket,
          WHITE,
          token,
          user.name,
          user.id,
          user.rating
        );
        const player2 = new Player(null, BLACK, null, "", "", 0);
        const game = new Game(player1, player2, true, stake);
        console.log("Creating a friendly match -> ", game.getGameId());
        this.games.push(game);
        // Send this game id to frontend
        console.log("Sending this to frontend", game.getGameId());
        sendMessage(socket, {
          type: GETFRIENDLYMATCHID,
          payload: {
            gameId: game.getGameId(),
          },
        });
      }
    } else {
      // Check for ratings and match the players
      // Also check for all non friendly matches
      const game = this.games.find((game) => {
        return (
          !game.isFriendly &&
          game.matchRating(user.rating) &&
          game.stake === stake
        );
      });
      console.log("Matched Games -> ", game?.getGameId());
      if (!game) {
        // Push the game in this.games with a null player 2
        const player1 = new Player(
          socket,
          WHITE,
          token,
          user.name,
          user.id,
          user.rating
        );
        const player2 = new Player(null, BLACK, null, "", "", 0);
        const game = new Game(player1, player2, false, stake);
        console.log("Creating new game -> ", game.getGameId());
        this.games.push(game);
      } else {
        // match the opponent and start the game

        const player1 = game.getPlayer1();
        // Avoid creating game between the same player.
        if (player1.getPlayerId() !== user.id) {
          const player2 = game?.getPlayer2();
          player2?.setPlayerToken(token);
          player2?.setPlayerSocket(socket);
          player2?.setPlayerId(user.id);
          player2?.setPlayerName(user.name);
          player2?.setPlayerRating(user.rating);
          console.log("Adding new player to game -> ", game.getGameId());
          await game?.createGame();
        }
      }
    }
    // Create a new game if no ongoing game found
    // if (this.pendingUser === null) {
    //   const player = new Player(socket, WHITE, token, user.name, user.id);
    //   this.pendingUser = player;
    //   this.users.push(player);
    // } else {
    //   const player = new Player(socket, BLACK, token, user.name, user.id);
    //   // Avoid creating game between the same player.
    //   // Eg -> When a player opens the same link in the same browser
    //   if (this.pendingUser.getPlayerId() !== user.id) {
    //     this.users.push(player);
    //     const game = new Game(this.pendingUser, player);
    //     await game.createGame();
    //     this.games.push(game);
    //     this.pendingUser = null;
    //   }
    // }
  }

  async makeMove(socket: WebSocket, move: TMove) {
    const game = this.games.find(
      (game) =>
        (game.getPlayer1().getPlayer() === socket ||
          game.getPlayer2().getPlayer() === socket) &&
        game.getGameStatus() === IN_PROGRESS
    );
    if (game) {
      await game.makeMove(socket, move);
    } else
      sendMessage(socket, {
        type: GAMENOTFOUND,
      });
  }

  addGames(games: any) {
    games.forEach((game: any) => {
      const player1 = new Player(
        null,
        BLACK,
        null,
        game.blackPlayer.name,
        game.blackPlayer.id,
        game.blackPlayer.rating
      );
      const player2 = new Player(
        null,
        WHITE,
        null,
        game.whitePlayer.name,
        game.whitePlayer.id,
        game.whitePlayer.rating
      );
      this.users.push(player1);
      this.users.push(player2);
      const newGame = new Game(
        player2,
        player1,
        game.isFriendly,
        game.stake,
        game.id,
        game.status
      );
      const chess = seedBoard(
        game.Move.map((move: TMove) => ({
          from: move.from,
          to: move.to,
          promotion: move?.promotion,
        }))
      );
      newGame.setboard(chess.fen());
      newGame.setMoves(
        game.Move.map((move: TMove) => ({
          from: move.from,
          to: move.to,
          promotion: move?.promotion,
        }))
      );
      newGame.setSans(
        game.Move.map((move: TMove & { san: string }) => move.san)
      );
      this.games.push(newGame);
    });
  }

  initServer() {
    // Get all ongoing games
    db.game
      .findMany({
        where: {
          status: "IN_PROGRESS",
        },
        select: {
          board: true,
          Move: {
            select: {
              from: true,
              to: true,
              san: true,
              promotion: true,
            },
          },
          id: true,
          status: true,
          blackPlayer: true,
          whitePlayer: true,
          isFriendly: true,
        },
      })
      .then((games: any) => {
        this.addGames(games);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  async getAllGames(token: string, stake: string) {
    const user = await extractUser(token);
    if (!user || !user.name || !user.id) return [];
    return this.games.filter((game) => {
      return (
        !game.isFriendly &&
        game.matchRating(user?.rating) &&
        game.stake === stake
      );
    });
  }
}
