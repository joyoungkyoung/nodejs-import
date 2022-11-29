import axios from "axios";

interface ImpProps {
  imp_uid: string;
  merchant_uid: string;
}
export interface ResImpProps {
  success: boolean;
  status?: "vbankIssued" | "success" | "forgery";
  message?: string;
}
export const validPayment = async (body: ImpProps) => {
  console.log(body);
  const { imp_uid, merchant_uid } = body;
  //엑세스 토큰 발급
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
  //imp_uid로 아임포트 서버에서 결제정보 조회
  const getPaymentData = await axios({
    url: `https://api.iamport.kr/payments/${imp_uid}`,
    method: "get",
    headers: { Authorization: access_token },
  });
  const paymentData = getPaymentData.data.response; // 조회한 결제 정보

  // DB에서 결제되어야 하는 금액 조회
  const order = { amount: 100 }; //await Orders.findById(paymentData.merchant_uid);
  const amountToBePaid = order.amount; // 결제 되어야 하는 금액

  // 결제 검증하기
  console.log("결제정보:", paymentData);
  const { amount, status } = paymentData;
  // 결제금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
  if (amount === amountToBePaid) {
    //   await Orders.findByIdAndUpdate(merchant_uid, { $set: paymentData }); // DB에 결제 정보 저장
    switch (status) {
      case "ready": // 가상계좌 발급
        // DB에 가상계좌 발급 정보 저장
        const { vbank_num, vbank_date, vbank_name } = paymentData;
        //   await Users.findByIdAndUpdate("/* 고객 id */", {
        //     $set: { vbank_num, vbank_date, vbank_name },
        //   });
        return {
          success: true,
          status: "vbankIssued",
          message: "가상계좌 발급 성공",
        } as ResImpProps;
      case "paid": // 결제 완료
        return {
          success: true,
          status: "success",
          message: "일반 결제 성공",
        } as ResImpProps;
    }
  } else {
    // 결제금액 불일치. 위/변조 된 결제
    return {
      success: false,
      status: "forgery",
      message: "위조된 결제시도",
    } as ResImpProps;
  }
  return { success: false } as ResImpProps;
};
