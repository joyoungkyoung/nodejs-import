import * as express from "express";
import { postWebHook } from "../../controller/WebhookController";

const webHookRouter = express.Router();

webHookRouter.post("/", postWebHook);
export default webHookRouter;
