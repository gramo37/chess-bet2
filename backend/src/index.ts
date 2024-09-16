import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import { connect as connectToRedis, sendMovesToDB } from "./db/redis";
import user from "./routes/users";
import auth from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT ?? 5000;
const BACKEND_ROUTE = "api";

connectToRedis();

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

app.use(BACKEND_ROUTE, user);
app.use(`/${BACKEND_ROUTE}/auth`, auth);

cron.schedule("*/10 * * * * *", async function () {
  await sendMovesToDB();
});

app.listen(PORT, () => {
  console.log("Connected to PORT: ", PORT);
});
