import * as express from "express";
import { postCancel, postPaymentsComplete } from "../../../../service/payments";

const paymentsRouter = express.Router();

paymentsRouter.post("/complete", postPaymentsComplete);
paymentsRouter.post("/cancel", postCancel);

export default paymentsRouter;
