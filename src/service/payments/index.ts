import {
  ResponseFailed,
  ResponseSuccess,
  SystemError,
} from "../../util/response";
import { Request, Response } from "express";
import { ResImpProps, validPayment } from "./common";

export const postPaymentsComplete = async (req: Request, res: Response) => {
  try {
    const result: ResImpProps = await validPayment(req.body);
    if (result.success) {
      return ResponseSuccess(res, result);
    } else {
      return ResponseFailed(res, result);
    }
  } catch (e: any) {
    SystemError(res, e);
  }
};

export const postCancel = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    return ResponseSuccess(res);
  } catch (e: any) {
    SystemError(res, e);
  }
};
