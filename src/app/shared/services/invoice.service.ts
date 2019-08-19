import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { environment } from "src/environments/environment";
import { Iinvoice } from "../models";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class InvoiceService {
  static invoiceStore: Iinvoice[];
  constructor(private apiService: ApiService) {}
  createInvoice(body: Iinvoice, path: string): Observable<any> {
    const invoiceFormData = new FormData();
    invoiceFormData.append("file", body.file);
    invoiceFormData.append("invoice", JSON.stringify(body));
    return this.apiService.uploadPost(
      `${environment.invoice_url}/${path}`,
      invoiceFormData,
      path === "mail" ? "json" : "arrayBuffer"
    );
  }
  addInvoice(body: Iinvoice): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.invoice_url, body)
        .toPromise()
        .then(item => {
          if (InvoiceService.invoiceStore)
            InvoiceService.invoiceStore.push(item);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  getInvoices(): Observable<Iinvoice[]> {
    return this.apiService.get(environment.invoice_url);
  }
  getInvoiceStore(): Promise<Iinvoice[]> {
    return new Promise((resolve, reject) => {
      if (InvoiceService.invoiceStore) {
        console.log('return from cache');
        resolve(InvoiceService.invoiceStore);
      } else {
        this.getInvoices()
          .toPromise()
          .then(items => {
            InvoiceService.invoiceStore = items; // cache item data
            resolve(InvoiceService.invoiceStore);
          })
          .catch(error => reject(error));
      }
    });
  }
}
