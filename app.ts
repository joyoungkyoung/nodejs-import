import { Request, Response } from "express";
import apiRouter from "./src/routers/api/v1";
import viewRouter from "./src/routers/view";
import webHookRouter from "./src/routers/webhook";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const allowedOrigins = [
  "http://localhost:2008",
  "http://52.78.100.19",
  "http://52.78.48.223",
  "http://52.78.5.241", // 웹훅 테스트 발송 버튼으로 전송되는 경우
];

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin: string, callback: any) => {
      console.log(origin);
      if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed Origin!"));
      }
    },
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.static("public"));

app.use("/", viewRouter);
app.get("/", (req: Request, res: Response) => {
  res.render("index.ejs", { merchant_key: process.env.MERCHANT_KEY });
});
app.use("/api/v1", apiRouter);
app.use("/webhook", webHookRouter);

app.listen(process.env.PORT, () => {
  console.log("Environment:----- ", process.env.NODE_ENV);
  console.log("Server started successfully --- Port:", process.env.PORT);
});
