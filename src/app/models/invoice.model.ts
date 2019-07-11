export interface Iinvoice {
  label: IinvoiceTextLabel;
  invoiceNumber: number;
  sender: string;
  receiver: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  lineItem: IlineItem;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  shipping: number;
  amountPaid: number;
  balanceDue: number;
  notes: string;
  terms: string;
  tax_type: string;
  discount_type: string;
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
export interface IlineItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}
