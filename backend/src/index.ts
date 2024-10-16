
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { connect as connectToRedis, sendMovesToDB } from "./db/redis";
import user from "./routes/users";
import auth from "./routes/auth";
import game from "./routes/game";
import mpesa from "./routes/payments/mpesa";
import crypto from "./routes/payments/crypto";
import payment from "./routes/payments";
import report from "./routes/report";
import admin from "./routes/admin";
import { checkTransactionStatus } from "./controllers/payments/crypto";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT ?? 5000;
export const BACKEND_ROUTE = "api";

app.use(express.json({
  verify: (req: any, _, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));
connectToRedis();

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

app.use(`/${BACKEND_ROUTE}`, user);
app.use(`/${BACKEND_ROUTE}/auth`, auth);
app.use(`/${BACKEND_ROUTE}/payments`, payment);
app.use(`/${BACKEND_ROUTE}/payments/crypto`, crypto);
app.use(`/${BACKEND_ROUTE}/payments/mpesa`, mpesa);
app.use(`/${BACKEND_ROUTE}/game/`, game);
app.use(`/${BACKEND_ROUTE}/report/`, report);
app.use(`/${BACKEND_ROUTE}/admin/`, admin);

cron.schedule("*/10 * * * * *", async function () {
  await sendMovesToDB();
});

// cron.schedule('* * * * *', async () => {
//   await checkTransactionStatus();
// });

// TODO: Create a cron job to update all old pending transactions (older than 5 mins) as Cancelled every 5mins

app.listen(PORT, () => {
  console.log("Connected to PORT: ", PORT);
});


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally, gracefully shutdown the server
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});