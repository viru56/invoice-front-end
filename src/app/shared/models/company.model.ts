export interface Icompany {
  id?: string;
  name: String;
  email?: String;
  sendTo?: String;
  logoUrl?: string;
  logo?: { data: any; contentType: string };
  address?: String;
  city?: String;
  state?: String;
  postalCode?: Number;
  taxId?: String;
  subscription?: String;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  isDeleted?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
