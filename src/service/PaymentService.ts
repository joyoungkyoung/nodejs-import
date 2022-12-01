import {
  ResError,
  ResErrorProps,
  ResponseFailed,
  ResponseSuccess,
} from "../util/response";
import { Response } from "express";
import axios from "axios";
import PaymentsDB from "../repository/PaymentsDB";
import ProductsDB from "../repository/ProductsDB";
import { ResPaymentWithValid } from "../repository/PaymentsDB.data";

interface ImpProps {
  imp_uid: string;
  merchant_uid: string;
}
export interface ResImpProps {
  success: boolean;
  error?: ResErrorProps;
  status?: "vbankIssued" | "success" | "forgery" | "already";
  message?: string;
}

class PaymentService {
  getToken = async () => {
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: {
        imp_key: process.env.IAMPORT_REST_API_KEY, // REST API 키
        imp_secret: process.env.IAMPORT_REST_API_SECRET, // REST API Secret
      },
    });
    const { access_token } = getToken.data.response; // 인증 토큰
    return access_token;
  };

  getPaymentInfo = async (impUid: string, accessToken: string) => {
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${impUid}`,
      method: "get",
      headers: { Authorization: accessToken },
    });
    const paymentData = getPaymentData.data.response;
    return paymentData;
  };

  createMerchantUid = async (res: Response, productId: number) => {
    const product = await ProductsDB.findById(productId);
    if (!product) {
      return ResponseFailed(res, ResError.NOT_FOUND_DATA);
    }
    const result = await PaymentsDB.createMerchantUid(
      productId,
      product.amount
    );
    if (!result) {
      return ResponseFailed(res, ResError.FAILED_CREATE_MERCHANT_UID);
    }
    return ResponseSuccess(res, {
      merchant_uid: result.merchant_uid,
      name: product.product_nm,
      amount: result.amount,
    });
  };

  paymentCancel = async (
    res: Response,
    params: {
      reason: string;
      cancelRequestAmount: number;
      merchantUid: string;
    }
  ) => {
    const { reason, cancelRequestAmount } = params;
    let { merchantUid } = params;

    const accessToken = await this.getToken();
    const paymentData = await PaymentsDB.findByMerchantUid(merchantUid);
    const { imp_uid, amount, cancel_amount } = paymentData;
    const cancelableAmount = amount - (cancel_amount ? cancel_amount : 0); // 환불 가능 금액(= 결제금액 - 환불 된 총 금액) 계산
    if (cancelableAmount <= 0) {
      // 이미 전액 환불된 경우
      return ResponseFailed(res, ResError.ALREADY_REFUND_ALL);
    }

    //아임포트 REST API로 결제환불 요청
    const getCancelData = await axios({
      url: `https://api.iamport.kr/payments/cancel`,
      method: "post",
      headers: { Authorization: accessToken },
      data: {
        reason, // 가맹점 클라이언트로부터 받은 환불사유
        imp_uid: imp_uid, // imp_uid를 환불 `unique key`로 입력
        amount: cancelRequestAmount, // 가맹점 클라이언트로부터 받은 환불금액
        checksum: cancelableAmount, // [권장] 환불 가능 금액 입력
      },
    });
    // 환불 결과 동기화
    if (getCancelData.data.code !== 0) {
      const { code, message } = getCancelData.data;
      return ResponseFailed(res, { code, message });
    }
    const cancelResponse = getCancelData.data.response;
    const { merchant_uid } = cancelResponse; // 환불 결과에서 주문정보 추출
    await PaymentsDB.updatePaymentInfo(
      merchant_uid,
      cancelResponse as ResPaymentWithValid
    );

    return ResponseSuccess(res, cancelResponse);
  };

  validPayment = async (
    res: Response,
    params: {
      merchantUid: string;
      accessToken: string;
      paymentData: any;
    }
  ) => {
    const { merchantUid, paymentData } = params;

    const isValid = await PaymentsDB.isValidByMerchantUid(merchantUid);
    if (isValid) {
      return ResponseFailed(res, ResError.ALREADY_PAID);
    }
    // DB에서 결제되어야 하는 금액 조회
    const amountToBePaid = await PaymentsDB.findAmountByMerchantUid(
      paymentData.merchant_uid
    );

    // 결제 검증하기
    console.log("결제정보:", paymentData);
    const { amount, status } = paymentData;
    // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
    if (amount === amountToBePaid) {
      await PaymentsDB.updatePaymentInfo(merchantUid, {
        ...paymentData,
        is_valid: true,
      } as ResPaymentWithValid); // DB에 결제 정보 저장
      switch (status) {
        case "ready": // 가상계좌 발급
          // DB에 가상계좌 발급 정보 저장
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          //   await Users.findByIdAndUpdate("/* 고객 id */", {
          //     $set: { vbank_num, vbank_date, vbank_name },
          //   });
          return ResponseSuccess(res, {
            success: true,
            status: "vbankIssued",
            message: "가상계좌 발급 성공",
          } as ResImpProps);
        case "paid": // 결제 완료
          return ResponseSuccess(res, {
            success: true,
            status: "success",
            message: "일반 결제 성공",
          } as ResImpProps);
      }
    } else {
      // 결제금액 불일치. 위/변조 된 결제
      return ResponseFailed(res, ResError.FAKE_PAYMENT_ATTEMPT);
    }
    return { success: false } as ResImpProps;
  };
}

export default new PaymentService();
