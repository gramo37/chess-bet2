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
export const server = http.createServer(app);

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
)


const wss = new WebSocketServer({ server });
const gameManager = new GameManager();
gameManager.initServer();

wss.on("connection", async function connection(ws, req) {
  let token = req?.url ? url.parse(req.url, true).query.token : null;
  let gameId = req?.url ? url.parse(req.url, true).query.gameId : null;
  let type = req?.url ? url.parse(req.url, true).query.type : null;
  let stake = req?.url ? url.parse(req.url, true).query.stake : null;
  let gameTime = req?.url ? url.parse(req.url, true).query.gameTime : null;

  if (gameId && typeof gameId !== "string") gameId = null;
  if (type && typeof type !== "string") type = null;
  if (stake && typeof stake !== "string") stake = null;
  if (token && typeof token !== "string") token = null;
  if (gameTime && typeof gameTime !== "string") gameTime = null;

  let isAuthorizedUser = await extractUser(token)
  if (!isAuthorizedUser) return ws.send(JSON.stringify({ "message": "Unauthorized user!" }))

  console.log("isAuthorizedUser", isAuthorizedUser)
  console.log(token, stake, type, gameId);

  if (token && stake && type)
    await gameManager.addUser({ socket: ws, token, type, stake, gameId, gameTime });

  ws.on("close", () => {
    gameManager.removeUser(ws);
  });
});

connect();

app.get("/ws", (req, res) => {
  res.send("Ping");
});

app.get("/ws/open_games", async (req, res) => {
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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally, gracefully shutdown the server
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const gracefulShutdown = (signal: NodeJS.Signals) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  gameManager.gracefulRestart();

  // Stop accepting new requests
  server.close(() => {
    console.log('Closed remaining connections.');
    // Close database connections or other clean-up here

    // Exit process after clean-up
    process.exit(0);
  });

  // Force exit if connections aren't closed after a timeout
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);