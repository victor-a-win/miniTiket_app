import { Event } from "./event.interface";

export type TransactionStatus =
  | 'waiting_for_payment'
  | 'waiting_for_admin'
  | 'confirmation'
  | 'done'
  | 'rejected'
  | 'expired'
  | 'canceled';

export interface TransactionPayload {
  quantity: number;
  usePoints: boolean;
  voucherCode?: string;
  couponCode?: string;
}

export interface Transaction {
  id: string;
  status: TransactionStatus;
  total_amount: number;
  payment_method: string;
  user_id: number;
  event_id: string;
  doku_payment_id?: string;
  doku_invoice?: string;
  doku_payment_url?: string;
  created_at: string;
  expired_at?: string;
  quantity: number;
  payment_date?: string;
  event?: Event;
};

