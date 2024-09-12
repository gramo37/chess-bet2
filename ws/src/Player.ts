import { WebSocket } from "ws";

export class Player {
  private id: string;
  private color: string;
  private player: WebSocket | null;
  private token: string | null;
  private name: string;
  private rating: number;

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
    this.name = name
  }

  setPlayerRating(rating: number) {
    this.rating = rating
  }

  setPlayerId(id: string) {
    this.id = id
  }
}
