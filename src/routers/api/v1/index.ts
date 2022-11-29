import * as express from "express";
import paymentsRouter from "./payments";

const apiRouter = express.Router();

apiRouter.use("/payments", paymentsRouter);

export default apiRouter;
