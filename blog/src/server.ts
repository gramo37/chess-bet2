import express from "express";
import payload from "payload";
import cors from "cors";
require("dotenv").config();
const app = express();

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(3333);
};

start();
