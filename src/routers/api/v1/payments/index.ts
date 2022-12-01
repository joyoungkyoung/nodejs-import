import * as express from "express";
import {
  postCancel,
  postPaymentsComplete,
  postPaymentsStart,
} from "../../../../controller/PaymentController";

const paymentsRouter = express.Router();

paymentsRouter.post("/start", postPaymentsStart);
paymentsRouter.post("/complete", postPaymentsComplete);
paymentsRouter.post("/cancel", postCancel);

export default paymentsRouter;
