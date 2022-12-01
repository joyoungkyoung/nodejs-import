import { SystemError } from "../util/response";
import { Request, Response } from "express";
import PaymentService from "../service/PaymentService";

export const postPaymentsStart = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.body;
    return PaymentService.createMerchantUid(res, product_id);
  } catch (e: any) {
    SystemError(res, e);
  }
};

export const postPaymentsComplete = async (req: Request, res: Response) => {
  const { imp_uid, merchant_uid } = req.body;

  //엑세스 토큰 발급
  const accessToken = await PaymentService.getToken();

  //imp_uid로 아임포트 서버에서 결제정보 조회
  const paymentData = await PaymentService.getPaymentInfo(imp_uid, accessToken);

  try {
    return await PaymentService.validPayment(res, {
      merchantUid: merchant_uid,
      accessToken,
      paymentData,
    });
  } catch (e: any) {
    PaymentService.paymentCancel(res, {
      cancelRequestAmount: paymentData.amount,
      merchantUid: merchant_uid,
      reason: "결제취소",
    });
    SystemError(res, e);
  }
};

export const postCancel = async (req: Request, res: Response) => {
  try {
    const { merchant_uid, reason, cancel_request_amount } = req.body;
    return PaymentService.paymentCancel(res, {
      merchantUid: merchant_uid,
      reason,
      cancelRequestAmount: cancel_request_amount,
    });
  } catch (e: any) {
    SystemError(res, e);
  }
};
