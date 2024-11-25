import { WebSocket } from "ws";
import { db } from "./db";

export class Player {
  private id: string;
  private color: string;
  private player: WebSocket | null;
  private token: string | null;
  private name: string;
  private rating: number;
  private isAiOpponent = false;
  constructor(
    socket: WebSocket | null,
    color: string,
    token: string | null,
    name: string,
    id: string,
    rating: number
  ) {
    this.color = color;
    this.player = socket;
    this.token = token;
    this.name = name;
    this.id = id;
    this.rating = rating;
  }

  setRandom(random: boolean) {
    this.isAiOpponent = random;
  }
  isAIOpponent() {
    return this.isAiOpponent;
  }
  getPlayer() {
    return this.player;
  }

  getPlayerColor() {
    return this.color;
  }

  getPlayerSocket() {
    return this.player;
  }

  getPlayerToken() {
    return this.token;
  }

  getPlayerName() {
    return this.name;
  }

  async getPlayerUserName() {
    try {
      if (this.isAiOpponent) return this.name;
      const user = await db.user.findFirst({
        where: {
          id: this.id,
        },
        select: {
          username: true,
        },
      });
      return user?.username ?? null;
    } catch (error) {
      console.log("Error fetching user name");
      return null;
    }
  }

  getPlayerId() {
    return this.id;
  }

  getPlayerRating() {
    return this.rating;
  }

  setPlayerSocket(socket: WebSocket) {
    this.player = socket;
  }

  setPlayerToken(token: string) {
    this.token = token;
  }

  setPlayerName(name: string) {
    this.name = name;
  }

  setPlayerRating(rating: number) {
    this.rating = rating;
  }

  setPlayerId(id: string) {
    this.id = id;
  }
}
