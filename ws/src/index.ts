import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { VirtualGameManager } from "./VirtualGameManager";
import url from "url";
import { connect } from "./db/redis";
import express from "express";
import cors from "cors";
import http from "http";
import { extractUser } from "./auth";

const PORT = process.env.WEBSOCKET_PORT ?? 8080;

const app = express();
export const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : [];

console.log(allowedHosts);

app.use(cors());

const wss = new WebSocketServer({ server });
const gameManager = new GameManager();
const virtualGameManager = new VirtualGameManager();
gameManager.initServer();

wss.on("connection", async function connection(ws, req) {
  let token = req?.url ? url.parse(req.url, true).query.token : null;
  let gameId = req?.url ? url.parse(req.url, true).query.gameId : null;
  let type = req?.url ? url.parse(req.url, true).query.type : null;
  let stake = req?.url ? url.parse(req.url, true).query.stake : null;
  let gameTime = req?.url ? url.parse(req.url, true).query.gameTime : null;
  let isVirtual = req?.url ? url.parse(req.url, true).query.isVirtual : null;

  if (gameId && typeof gameId !== "string") gameId = null;
  if (type && typeof type !== "string") type = null;
  if (stake && typeof stake !== "string") stake = null;
  if (token && typeof token !== "string") token = null;
  if (gameTime && typeof gameTime !== "string") gameTime = null;
  if (isVirtual && typeof isVirtual !== "string") isVirtual = null;

  let isAuthorizedUser = await extractUser(token);
  if (!isAuthorizedUser)
    return ws.send(JSON.stringify({ message: "Unauthorized user!" }));

  console.log("isAuthorizedUser", isAuthorizedUser);
  console.log(token, stake, type, gameId, isVirtual);

  if (token && stake && type) {
    if (isVirtual && isVirtual == "true") {
      console.log("create virtual game", isVirtual);
      await virtualGameManager.addUser({
        socket: ws,
        token,
        type,
        stake,
        gameId,
        gameTime,
      });
    } else {
      console.log("real", isVirtual);
      await gameManager.addUser({
        socket: ws,
        token,
        type,
        stake,
        gameId,
        gameTime,
      });
    }
  }

  ws.on("close", () => {
    if (!isVirtual || (isVirtual && isVirtual == "false"))
      gameManager.removeUser(ws);
    else virtualGameManager.removeUser(ws);
  });
});

connect();

app.get("/ws", (req, res) => {
  res.send("Ping");
});

app.get("/ws/open_games", async (req, res) => {
  let { token, stake, isVirtual } = req.query;
  if (token && typeof token !== "string") token = "";
  if (stake && typeof stake !== "string") stake = "";
  if (isVirtual && typeof isVirtual !== "string") isVirtual = "";
  let games;
  if (isVirtual && isVirtual == "true") {
    console.log("isVirtual");
    games =
      token && stake ? await virtualGameManager.getAllGames(token, stake) : [];
  } else {
    console.log("real");
    games = token && stake ? await gameManager.getAllGames(token, stake) : [];
  }
  res.status(200).json({
    games,
  });
});

server.listen(PORT, () => {
  console.log("Connected to PORT: ", PORT);
});

console.log("Done");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Optionally, gracefully shutdown the server
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
