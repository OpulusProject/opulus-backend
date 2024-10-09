import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import deserializeUser from "@middleware/deserializeUser";
import router from "@routes/router";
import logResponse from "@middleware/logResponse";

const app = express();

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(deserializeUser);
app.use(logResponse);

app.use("/api", router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`);
});
