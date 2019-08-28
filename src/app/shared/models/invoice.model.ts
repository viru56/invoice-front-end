import { Itax } from "./tax.model";
import { IlineItem } from "./item.model";
export interface Iinvoice {
  id?: string;
  label?: IinvoiceTextLabel;
  name: string;
  number: number;
  sender: string;
  receiver: string;
  date: Date;
  paymentTerms?: string;
  dueDate: Date;
  lineItems: IlineItem[];
  subtotal: number;
  discountType: string;
  discountValue: number;
  taxItems?: Itax[];
  total: number;
  shipping: number;
  amountPaid: number;
  balanceDue: number;
  notes: string;
  terms: string;
  taxableAmount?: number;
  nonTaxableAmount?: number;
  file?: File;
  status?: string;
  mail?: {
    userName: string;
    from: string;
    to: string;
    subject: string;
    message: string;
    bcc: string;
  };
  customer?: string;
  customerName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IinvoiceTextLabel {
  name: string;
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
