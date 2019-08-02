export interface Icompany {
  name: String;
  email?: String;
  sendTo?: String;
  logoUrl?: String;
  address?: String;
  city?: String;
  state?: String;
  postalCode?: Number;
  taxId?: String;
  subscription?:String;
  subscriptionStartDate?:Date;
  subscriptionEndDate?:Date;
  isDeleted?:Boolean;
}
