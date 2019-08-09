export interface IlineItem {
    id?: string;
    name: string;
    type?: string;
    description?: string;
    unitCost: number;
    taxable: boolean;
    quantity?:number;
    amount?:number;
  }