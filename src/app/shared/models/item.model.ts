export interface IlineItem {
    id?: number;
    name: string;
    type?: string;
    description?: string;
    unitCost: number;
    taxable: boolean;
    quantity?:number;
    amount?:number;
  }