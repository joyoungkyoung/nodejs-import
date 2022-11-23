import { Request, Response } from "express";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const logger = require("morgan");

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const allowedOrigins = ["http://localhost:3000"];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin: string, callback: any) => {
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

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    code: "OK200",
    message: "OK",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Environment:----- ", process.env.NODE_ENV);
  console.log("Server started successfully --- Port:", process.env.PORT);
});
