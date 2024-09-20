import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { connect as connectToRedis, sendMovesToDB } from "./db/redis";
import user from "./routes/users";
import auth from "./routes/auth";
import game from "./routes/game";
import payment from "./routes/payments";
import report from "./routes/report";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT ?? 5000;
const BACKEND_ROUTE = "api";

app.use(express.json());
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
);

app.use(`/${BACKEND_ROUTE}`, user);
app.use(`/${BACKEND_ROUTE}/auth`, auth);
app.use(`/${BACKEND_ROUTE}/payments`, payment);
app.use(`/${BACKEND_ROUTE}/game/`, game);
app.use(`/${BACKEND_ROUTE}/report/`, report);

cron.schedule("*/10 * * * * *", async function () {
  await sendMovesToDB();
});

// TODO: Create a cron job to update all old pending transactions (older than 5 mins) as Cancelled every 5mins

app.listen(PORT, () => {
  console.log("Connected to PORT: ", PORT);
});
