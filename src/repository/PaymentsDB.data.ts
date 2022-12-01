export type PayMethodType =
  | "samsung" // 삼성페이
  | "card" //신용카드
  | "trans" //계좌이체
  | "vbank" //가상계좌
  | "phone" //휴대폰
  | "cultureland" //문화상품권
  | "smartculture" //스마트문상
  | "booknlife" //도서문화상품권
  | "happymoney" //해피머니
  | "point" //포인트
  | "ssgpay" //SSGPAY
  | "lpay" //LPAY
  | "payco" //페이코
  | "kakaopay" //카카오페이
  | "tosspay" //토스
  | "naverpay"; //네이버페이
export type ChannelType = "pc" | "mobile" | "api";
export type CardCodeType =
  | "361" //BC카드
  | "364" //광주카드
  | "365" //삼성카드
  | "366" //신한카드
  | "367" //현대카드
  | "368" //롯데카드
  | "369" //수협카드
  | "370" //씨티카드
  | "371" //NH카드
  | "372" //전북카드
  | "373" //제주카드
  | "374" //하나SK카드
  | "381" //KB국민카드
  | "041" //우리카드
  | "071"; //우체국
export type PaymentStatus = "ready" | "paid" | "cancelled" | "failed";
export type CustomerUidUsageType = "issue" | "payment" | "payment.scheduled";
interface PaymentCancelAnnotation {
  pg_tid: string;
  amount: number;
  cancelled_at: number;
  reason: string;
  receipt_url: string;
}
export interface PaymentColumns {
  merchant_uid?: string;
  imp_uid?: string;
  amount: number;
  cancel_amount?: number;
  currency: string; //결제승인화폐단위(KRW:원, USD:미화달러, EUR:유로)
  status: PaymentStatus; //결제상태.
  is_valid?: boolean;
  pay_method?: PayMethodType;
  channel?: ChannelType;
  pg_provider?: string; //PG사 명칭. inicis(이니시스) / nice(나이스정보통신)
  emb_pg_provider?: string; //허브형결제 PG사 명칭. chai(차이) / kakaopay(카카오페이)
  pg_tid?: string; //PG사 승인정보
  pg_id?: string; //거래가 처리된 PG사 상점아이디
  escrow?: boolean; //에스크로결제 여부
  apply_num?: string; //카드사 승인정보(계좌이체/가상계좌는 값 없음)
  bank_code?: string; //은행 표준코드 - (금융결제원기준)
  bank_name?: string; //은행 명칭 - (실시간계좌이체 결제 건의 경우)
  card_code?: CardCodeType; //카드사 코드번호(금융결제원 표준코드번호)
  card_name?: string; //카드사 명칭 - (신용카드 결제 건의 경우)
  card_quota?: number; //할부개월 수(0이면 일시불)
  card_number?: string; //결제에 사용된 마스킹된 카드번호.
  card_type?: string; //카드유형 (null: 해당 정보가 없는 PG사, 0: 신용카드, 1: 체크카드)
  vbank_code?: string; //가상계좌 은행 표준코드 - (금융결제원기준)
  vbank_name?: string; //입금받을 가상계좌 은행명
  vbank_num?: string; //입금받을 가상계좌 계좌번호
  vbank_holder?: string; //입금받을 가상계좌 예금주
  vbank_date?: number | Date; //입금받을 가상계좌 마감기한 UNIX timestamp
  vbank_issued_at?: number | Date; //가상계좌 생성 시각 UNIX timestamp
  buyer_name?: string; // 주문자명
  buyer_email?: string; // 주문자 Email주소
  buyer_tel?: string; //주문자 전화번호
  buyer_addr?: string; //주문자 주소
  buyer_postcode?: string; //주문자 우편번호
  custom_data?: string; // 가맹점에서 전달한 custom data
  started_at?: Date; // 결제시작시점 UNIX timestamp. IMP.request_pay() 를 통해 결제창을 최초 오픈한 시각 ,
  paid_at?: Date; // 결제완료시점 UNIX timestamp. 결제완료가 아닐 경우 0
  failed_at?: Date; // 결제실패시점 UNIX timestamp. 결제실패가 아닐 경우 0
  cancelled_at?: Date; // 결제취소시점 UNIX timestamp. 결제취소가 아닐 경우 0
  fail_reason?: string; // 결제실패 사유
  cancel_reason?: string; // 결제취소 사유
  receipt_url?: string; // 신용카드 매출전표 확인 URL
  cancel_history?: string; // 취소/부분취소 내역 -> Array[PaymentCancelAnnotation]
  cancel_receipt_urls?: string;
  cash_receipt_issued?: boolean; // 현금영수증 자동발급 여부
  customer_uid?: string; // 해당 결제처리에 사용된 customer_uid. 결제창을 통해 빌링키 발급 성공한 결제건의 경우 요청된 customer_uid 값을 응답합니다.
  customer_uid_usage?: CustomerUidUsageType; // customer_uid가 결제처리에 사용된 상세 용도.(null:일반결제, issue:빌링키 발급, payment:결제, payment.scheduled:예약결제
}

export interface ResIamportPayment {
  imp_uid: string;
  merchant_uid?: string;
  pay_method: string;
  channel: string;
  pg_provider: string;
  emb_pg_provider: string;
  pg_tid: string;
  pg_id: string;
  escrow: true;
  apply_num: string;
  bank_code: string;
  bank_name: string;
  card_code: string;
  card_name: string;
  card_quota: number;
  card_number: string;
  card_type: string;
  vbank_code: string;
  vbank_name: string;
  vbank_num: string;
  vbank_holder: string;
  vbank_date: number;
  vbank_issued_at: number;
  name?: string;
  amount: number;
  cancel_amount: number;
  currency: string;
  buyer_name: string;
  buyer_email: string;
  buyer_tel: string;
  buyer_addr: string;
  buyer_postcode: string;
  custom_data: string;
  user_agent: string;
  status: string;
  started_at: number;
  paid_at: number;
  failed_at: number;
  cancelled_at: number;
  fail_reason: string;
  cancel_reason: string;
  receipt_url: string;
  cancel_history: PaymentCancelAnnotation[];
  cancel_receipt_urls: string[];
  cash_receipt_issued: boolean;
  customer_uid: string;
  customer_uid_usage: string;
}

export interface ResPaymentWithValid extends ResIamportPayment {
  is_valid: boolean;
}
