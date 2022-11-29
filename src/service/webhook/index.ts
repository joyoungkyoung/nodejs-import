import {
  ResponseFailed,
  ResponseSuccess,
  SystemError,
} from "../../util/response";
import { Request, Response } from "express";
import { ResImpProps, validPayment } from "../payments/common";

export const postWebHook = async (req: Request, res: Response) => {
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
