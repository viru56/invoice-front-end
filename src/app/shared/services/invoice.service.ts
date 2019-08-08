import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { environment } from "src/environments/environment";
import { Iinvoice } from '../models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: "root"
})
export class InvoiceService {
  constructor(private apiService: ApiService) {}
  createInvoice(body:Iinvoice,path:string):Observable<any> {
    const invoiceFormData = new FormData();
    invoiceFormData.append('file',body.file);
    invoiceFormData.append('invoice',JSON.stringify(body))
   return  this.apiService
      .upload(`${environment.invoice_url}/${path}`,invoiceFormData,path==='mail'?'json':'arrayBuffer');
  }
}
