import { OkPacket } from "mysql";
import Conn from "../db";
import { UnixTimestampToDate } from "../util/functions";
import {
  CardCodeType,
  ChannelType,
  CustomerUidUsageType,
  PaymentColumns,
  PaymentStatus,
  PayMethodType,
  ResPaymentWithValid,
} from "./PaymentsDB.data";

class PaymentsDB {
  async createMerchantUid(product_id: number, amount: number) {
    const sql = `INSERT INTO payments (product_id, merchant_uid, amount) VALUES(?,REPLACE(UUID(), '-', ''),?)`;
    const value = [product_id, amount];

    const result: OkPacket = (await Conn.Excute(sql, value)) as OkPacket;
    const sql2 = `SELECT merchant_uid, amount FROM payments WHERE payment_id = ?`;
    const payment: PaymentColumns = (await Conn.GetOne(sql2, [
      result.insertId,
    ])) as PaymentColumns;
    return result.insertId > 0 ? payment : null;
  }

  async isValidByMerchantUid(merchant_uid: string) {
    const sql = `SELECT is_valid FROM payments WHERE merchant_uid=?`;
    const result: PaymentColumns = (await Conn.GetOne(sql, [
      merchant_uid,
    ])) as PaymentColumns;
    return result.is_valid;
  }

  async findAmountByMerchantUid(merchant_uid: string) {
    const sql = `SELECT amount FROM payments WHERE merchant_uid=?`;
    const result: PaymentColumns = (await Conn.GetOne(sql, [
      merchant_uid,
    ])) as PaymentColumns;
    return result.amount;
  }

  async findByMerchantUid(merchant_uid: string) {
    const sql = `SELECT imp_uid, amount, cancel_amount FROM payments WHERE merchant_uid=?`;
    const result: PaymentColumns = (await Conn.GetOne(sql, [
      merchant_uid,
    ])) as PaymentColumns;
    return result;
  }

  async updatePaymentInfo(merchant_uid: string, param: ResPaymentWithValid) {
    delete param.merchant_uid;
    delete param.name;
    const conditions: PaymentColumns = {
      imp_uid: param.imp_uid,
      amount: param.amount,
      cancel_amount: param.cancel_amount,
      currency: param.currency,
      pg_provider: param.pg_provider,
      emb_pg_provider: param.emb_pg_provider,
      pg_tid: param.pg_tid,
      pg_id: param.pg_id,
      escrow: param.escrow,
      apply_num: param.apply_num,
      bank_code: param.bank_code,
      bank_name: param.bank_name,
      card_name: param.card_name,
      card_quota: param.card_quota,
      card_number: param.card_number,
      card_type: param.card_type,
      // vbank_code: param.vbank_code,
      // vbank_name: param.vbank_name,
      // vbank_num: param.vbank_num,
      // vbank_holder: vbank.vbank_holder,
      // vbank_date: param.vbank_date,
      // vbank_issued_at: param.vbank_issued_at,
      buyer_name: param.buyer_name,
      buyer_email: param.buyer_email,
      buyer_tel: param.buyer_tel,
      buyer_addr: param.buyer_addr,
      buyer_postcode: param.buyer_postcode,
      custom_data: param.custom_data,
      fail_reason: param.fail_reason,
      cancel_reason: param.cancel_reason,
      receipt_url: param.receipt_url,
      cash_receipt_issued: param.cash_receipt_issued,
      customer_uid: param.customer_uid,
      status: param.status as PaymentStatus,
      pay_method: param.pay_method as PayMethodType,
      channel: param.channel as ChannelType,
      card_code: param.card_code as CardCodeType,
      customer_uid_usage: param.customer_uid_usage as CustomerUidUsageType,
      paid_at: UnixTimestampToDate(param.paid_at),
      started_at: UnixTimestampToDate(param.started_at),
      failed_at: UnixTimestampToDate(param.failed_at),
      cancelled_at: UnixTimestampToDate(param.cancelled_at),
      vbank_issued_at: UnixTimestampToDate(param.vbank_issued_at),
      cancel_history: JSON.stringify(param.cancel_history),
      cancel_receipt_urls: JSON.stringify(param.cancel_receipt_urls),
    };
    if (param.is_valid !== undefined) {
      conditions.is_valid = param.is_valid;
    }

    const sql = `UPDATE payments SET ? WHERE merchant_uid=?`;
    const result: OkPacket = (await Conn.Excute(sql, [
      conditions,
      merchant_uid,
    ])) as OkPacket;
    return result.affectedRows > 0;
  }
}

export default new PaymentsDB();
