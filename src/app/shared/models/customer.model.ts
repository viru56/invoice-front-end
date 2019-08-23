export interface Icustomer {
  id?: string;
  fullName: string;
  email: string;
  taxId: string;
  accountId: string;
  notes: string;
  attentionTo: string;
  phone: number;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postalCode: number;
  country: string;
  collections?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
