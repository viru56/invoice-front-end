import { Icompany } from './company.model';

export interface Iuser {
    id?:string;
    fullName:String;
    phone?:Number;
    email:String;
    role:String;
    status:string;
    company?:Icompany;
}