import { Itax } from "./tax.model";
import { IlineItem } from "./item.model";
export interface Iinvoice {
  label?: IinvoiceTextLabel;
  invoiceName: string;
  invoiceNumber: number;
  sender: string;
  receiver: string;
  date: string;
  paymentTerms?: string;
  dueDate: string;
  lineItem: IlineItem;
  subtotal: number;
  discount: Itype;
  tax?: Itax[];
  total: number;
  shipping: number;
  amountPaid: number;
  balanceDue: number;
  notes: string;
  terms: string;
  taxableAmount?: number;
  nonTaxableAmount?: number;
}
export interface IinvoiceTextLabel {
  invoiceName: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  lineItemName: string;
  lineItemQuantity: string;
  lineItemRate: string;
  lineItemAmount: string;
  subtotal: string;
  discount: string;
  tax: string;
  shipping: string;
  total: string;
  amountPaid: string;
  balanceDue: string;
  notes: string;
  terms: string;
}
export interface Itype {
  type: string;
  value: number;
}
