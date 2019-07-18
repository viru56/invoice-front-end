export interface Icustomer {
  id?:number;
  name: string;
  email: string;
  taxId: string;
  account: string;
  notes: string;
  collections:number;
  address: Iaddress;
}

export interface Iaddress {
  attentionTo: string;
  phone: number;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postalCode: number;
  country: string;
}
