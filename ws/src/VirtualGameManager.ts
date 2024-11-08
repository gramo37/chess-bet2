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
  SHOW_ERROR,
  RESTART_SERVER,
} from "./constants";
import { Game } from "./Game";
import { Player } from "./Player";
import { sendMessage } from "./utils";
import { extractUser } from "./auth";
import { db } from "./db";
import { TMove } from "./types/game.types";
import { TEndGamePayload } from "./types";
import { seedBoard } from "./utils/game";
import { SendRandomPlayNotificationToAdmin } from "./verify";

export class VirtualGameManager {
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
    gameTime?: string | null;
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
    gameTime?: string | null;
  }) {
    const self = this;
    const { socket, token, type, stake, gameId, gameTime } = data;
    socket.on("message", async function connection(data) {
      const message = JSON.parse(data.toString());
      switch (message?.type) {
        case INIT_GAME:
          await self.initGame(socket, token, stake, type, gameId, gameTime);
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
    if (!user || !user.name || !user.id) {
      console.log("User not found for abort.");
      return sendMessage(socket, {
        type: GAMEABORTED,
      });
    }
    console.log("Aborting the game for user ->", user.id);
    // Find the user's game from this.games
    const game = this.games.find((game) => {
      const player1Id = game.getPlayer1().getPlayerId();
      const player2Id = game.getPlayer2().getPlayerId();
      return (
        (player1Id === user.id || player2Id === user.id) &&
        game.getGameStatus() === NOT_YET_STARTED
      );
    });
    // Before deleting it check if the game is started or not
    if (game) {
      console.log("User has the game to aborted -> ", game.getGameId());
      this.games = this.games.filter(
        (gm) => gm.getGameId() !== game.getGameId()
      );
    }
    return sendMessage(socket, {
      type: GAMEABORTED,
    });
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
    console.log("Ending Game -> ", game?.getGameId());
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
    gameId?: string | null,
    gameTime?: string | null
  ) {
    const user = await extractUser(token);
    if (!user || !user.name || !user.id) return;
    // Check for pending games in db for the player
    // if a game is already present for the player we will restart that game

    const virtualGameCount = await db.game.count({
      where: {
        OR: [{ blackPlayerId: user.id }, { whitePlayerId: user.id }],
        status: "COMPLETED",
        isVirtual: true,
      },
    });
    if (virtualGameCount >= 20) {
      sendMessage(socket, {
        type: GAMEABORTED,
      });
      sendMessage(socket, {
        type: SHOW_ERROR,
        payload: {
          message: "Maximum 20 virtual games can be played",
        },
      });
      return;
    }

    let db_game = await db.game.findFirst({
      where: {
        OR: [{ blackPlayerId: user.id }, { whitePlayerId: user.id }],
        status: IN_PROGRESS,
        isVirtual: true,
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
        return sendMessage(socket, {
          type: SHOW_ERROR,
          payload: {
            message: "You have a pending game. Kindly complete it!",
          },
        });
      }
      return;
    }

    // Check for balance and stake here
    // Don't proceed if balance is less than stake
    if (Number(stake) > user.virtualBalance) {
      sendMessage(socket, {
        type: GAMEABORTED,
      });
      sendMessage(socket, {
        type: SHOW_ERROR,
        payload: {
          message: "Insufficient balance",
        },
      });
      return;
    }

    if (Number(stake) < 5) {
      sendMessage(socket, {
        type: GAMEABORTED,
      });
      sendMessage(socket, {
        type: SHOW_ERROR,
        payload: {
          message: "Minimum allowed stake is $5",
        },
      });
      return;
    }

    // Avoid single user to create multiple games
    const game = this.games.find((game) => {
      const player1Id = game.getPlayer1().getPlayerId();
      const player2Id = game.getPlayer2().getPlayerId();
      return (
        (player1Id === user.id || player2Id === user.id) &&
        game.getGameStatus() !== "COMPLETED"
      );
    });
    if (game) {
      console.log("User is trying to create one more game");
      console.log("Therefore deleting the old game");
      this.games = this.games.filter(
        (gm) => gm.getGameId() !== game.getGameId()
      );
    }

    if (type === "friend") {
      // In this case don't check for ratings
      console.log("Creating a friendly match", gameId);
      if (Boolean(gameId)) {
        console.log("Starting the game", gameId);
        // Start the game
        const game = this.games.find(
          (item) =>
            item.getGameStatus() === NOT_YET_STARTED &&
            item.getGameId() === gameId
        );
        console.log("Game Found -> ", game?.getGameId());
        if (game) {
          const player1 = game?.getPlayer1();
          // Avoid creating game between the same player.
          if (player1?.getPlayerId() !== user.id) {
            // Check if the balance of the player 2 is greater than stake
            console.log(
              "User balance and game stake comparison",
              user.virtualBalance,
              Number(game.stake)
            );
            if (user.virtualBalance > Number(game.stake)) {
              const player2 = game?.getPlayer2();
              player2?.setPlayerToken(token);
              player2?.setPlayerSocket(socket);
              player2?.setPlayerId(user.id);
              player2?.setPlayerName(user.name);
              player2?.setPlayerRating(user.rating);
              await game?.createGame();
            } else {
              sendMessage(socket, {
                type: GAMEABORTED,
              });
            }
          }
        } else {
          sendMessage(socket, {
            type: GAMEABORTED,
          });
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
        const game = new Game(
          player1,
          player2,
          true,
          stake,
          undefined,
          undefined,
          Number(gameTime),
          true
        );
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
    } else if (["lobby", "random"].includes(type ?? "")) {
      // Check for ratings and match the players
      // Also check for all non friendly matches
      const game = this.games.find((game) => {
        return (
          game.getGameStatus() === NOT_YET_STARTED &&
          !game.isFriendly &&
          // Check nearest rating only if type === "random"
          game.matchRating(user.rating) &&
          (type === "lobby" || (type === "random" && game.stake === stake))
          // (type === "lobby" ||
          //   (type === "random" && game.matchRating(user.rating))) &&
          // game.stake === stake
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
        const game = new Game(
          player1,
          player2,
          false,
          stake,
          undefined,
          undefined,
          undefined,
          true
        );
        console.log("Creating new game -> ", game.getGameId());
        this.games.push(game);
        // SendRandomPlayNotificationToAdmin(game.getGameId()); //sends notification to the admin that player has created random play
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
        game.status,
        undefined,
        true
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
      // Set Timerleft for each player
      const lastPlayedMove = game.Move.find((move: any) => {
        return move.moveNumber === game.Move.length;
      });
      newGame.player1TimeLeft = lastPlayedMove.player1TimeLeft;
      newGame.player2TimeLeft = lastPlayedMove.player2TimeLeft;
      this.games.push(newGame);
    });
  }

  initServer() {
    // Get all ongoing games
    db.game
      .findMany({
        where: {
          status: "IN_PROGRESS",
          isVirtual: true,
        },
        select: {
          board: true,
          Move: {
            select: {
              from: true,
              to: true,
              san: true,
              promotion: true,
              player1TimeLeft: true,
              player2TimeLeft: true,
              moveNumber: true,
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
    console.log(this.games.length, "gjj");
    return this.games.filter((game) => {
      return (
        game.getGameStatus() === NOT_YET_STARTED &&
        !game.isFriendly
      );
    });
  }
  async gracefulRestart() {
    let allPlayers = this.games
      .map((game) => {
        if ([NOT_YET_STARTED, IN_PROGRESS].includes(game.getGameStatus())) {
          return [game.getPlayer1(), game.getPlayer2()];
        }
      })
      .filter((player) => player !== undefined)
      .flat();

    allPlayers.forEach((player) => {
      if (player) {
        sendMessage(player?.getPlayer(), {
          type: RESTART_SERVER,
        });
      }
    });

    this.games = [];
  }
}
