import {Itax} from './tax.model';
export interface Iitem {
    id: number;
    name: string;
    type: string;
    description: string;
    unitCost: number;
    taxable: boolean;
    taxIds?:number[];
    taxRate?:String;
  }