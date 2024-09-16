import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import { connect } from "./db/redis";
import express from "express";
import cors from "cors";
import http from "http";
import { extractUser } from "./auth";

const PORT = process.env.WEBSOCKET_PORT ?? 8080;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : [];

console.log(allowedHosts);

app.use(
  cors({
    origin: allowedHosts,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const wss = new WebSocketServer({ server });
const gameManager = new GameManager();
gameManager.initServer();

wss.on("connection", async function connection(ws, req) {
  let token = req?.url ? url.parse(req.url, true).query.token : null;
  let gameId = req?.url ? url.parse(req.url, true).query.gameId : null;
  let type = req?.url ? url.parse(req.url, true).query.type : null;
  let stake = req?.url ? url.parse(req.url, true).query.stake : null;
  if (gameId && typeof gameId !== "string") gameId = null;
  if (type && typeof type !== "string") type = null;
  if (stake && typeof stake !== "string") stake = null;
  if (token && typeof token !== "string") token = null;

  let isAuthorizedUser = await extractUser(token)
  if (!isAuthorizedUser) return ws.send(JSON.stringify({ "message": "Unauthorized user!" }))

  console.log("isAuthorizedUser", isAuthorizedUser)
  console.log(token, stake, type, gameId);

  if (token && stake && type)
    await gameManager.addUser({ socket: ws, token, type, stake, gameId });

  ws.on("close", () => {
    gameManager.removeUser(ws);
  });
});

connect();

app.get("/", (req, res) => {
  res.send("Ping");
});

app.get("/open_games", async (req, res) => {
  let { token, stake } = req.query;
  if (token && typeof token !== "string") token = "";
  if (stake && typeof stake !== "string") stake = "";
  const games = (token && stake) ? await gameManager.getAllGames(token, stake) : [];
  res.status(200).json({
    games,
  });
});

server.listen(PORT, () => {
  console.log("Connected to PORT: ", PORT);
});

console.log("Done");
