import { Response } from "express";

export const SystemError = (res: Response, error: Error) => {
  console.log(error);
  res.status(500).json({
    code: "SYS500",
    message: "System Error",
  });
};

export const ResponseFailed = (res: Response, message: any) => {
  console.log(message.message);
  res.status(400).json(message);
};

export const ResponseSuccess = (res: Response, data?: any) => {
  res.status(200).json({
    code: "OK200",
    message: "OK",
    data,
  });
};

export const ResponseUnauthorized = (res: Response) => {
  res.status(401).json({
    code: "UNAUTH401",
    message: "Unauthorized",
  });
};
export const ResponseAccessDenied = (res: Response) => {
  res.status(403).json(ResError.ACCESS_DENIED);
};

export interface ResErrorProps {
  code: string;
  message: string;
}
export const ResError: { [key: string]: ResErrorProps } = {
  ACCESS_DENIED: { code: "ACCESS403", message: "Access Denied" },
  NOT_FOUND_DATA: { code: "COM0001", message: "Not found data" },
  FAILED_CREATE_MERCHANT_UID: {
    code: "PAYMENT0001",
    message: "merchant_uid 생성 실패",
  },
  ALREADY_PAID: { code: "PAYMENT0002", message: "이미 완료된 결제검증" },
  FAKE_PAYMENT_ATTEMPT: { code: "PAYMENT0003", message: "위조된 결제시도" },
  ALREADY_REFUND_ALL: {
    code: "PAYMENT0004",
    message: "이미 전액환불된 주문입니다.",
  },
};
