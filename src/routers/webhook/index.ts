import * as express from "express";
import { postWebHook } from "../../service/webhook";

const webHookRouter = express.Router();

webHookRouter.post("/", postWebHook);
export default webHookRouter;
