import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import { connect } from "./db/redis";
import express from "express";
import cors from "cors";
import http from "http";

const PORT = process.env.WEBSOCKET_PORT ?? 8080;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",")
  : [];

console.log(allowedHosts)

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
  // TODO: Check if the given token is valid
  let gameId = req?.url ? url.parse(req.url, true).query.gameId : null;
  let type = req?.url ? url.parse(req.url, true).query.type : null;
  let stake = req?.url ? url.parse(req.url, true).query.stake : null;
  if (gameId && typeof gameId !== "string") gameId = null;
  if (type && typeof type !== "string") type = null;
  if (stake && typeof stake !== "string") stake = null;
  if (token && typeof token !== "string") token = null;

  console.log(token, stake, type, gameId)

  if(token && stake && type) await gameManager.addUser({ socket: ws, token, type, stake, gameId });

  ws.on("close", () => {
    gameManager.removeUser(ws);
  });
});

connect();

app.get("/", (req, res) => {
  res.send("Hello World")
})

server.listen(PORT, () => {
  console.log("Connected to PORT: ", PORT);
});

console.log("Done");
