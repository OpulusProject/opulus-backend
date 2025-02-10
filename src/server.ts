import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";

config();

import deserializeUser from "@middleware/deserializeUser";
import logResponse from "@middleware/logResponse";
import router from "@routes/router";

const SERVER_PORT = process.env.SERVER_PORT || 8080;

const app = express();

app.use(json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(deserializeUser);
app.use(logResponse);

app.use("/api", router);

app.listen(SERVER_PORT, () => {
  console.log(`Server is up and running at http://localhost:${SERVER_PORT}`);
});
