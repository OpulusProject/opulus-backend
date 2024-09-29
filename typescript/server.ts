import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`);
});
