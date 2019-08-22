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
    return this.apiService.postFile(
      `${environment.invoice_url}/${path}`,
      invoiceFormData,
      path === "mail" ? "json" : "arrayBuffer"
    );
  }
  addInvoice(body: Iinvoice): Promise<string> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.invoice_url, body)
        .toPromise()
        .then(item => {
          if (InvoiceService.invoiceStore)
            InvoiceService.invoiceStore.push(item);
          resolve(item.id);
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
  updateInvoice(body: Iinvoice): Promise<string> {
    return new Promise((resolve, reject) => {
      this.apiService
        .put(environment.invoice_url, body)
        .toPromise()
        .then(() => {
          for (let inv of InvoiceService.invoiceStore) {
            if (inv.id === body.id) {
              inv.name = body.name;
              inv.number = body.number;
              inv.amountPaid = body.amountPaid;
              inv.balanceDue = body.balanceDue;
              inv.customer = body.customer;
              inv.date = body.date;
              inv.discountType = body.discountType;
              inv.discountValue = body.discountValue;
              inv.dueDate = body.dueDate;
              inv.lineItems = body.lineItems;
              inv.nonTaxableAmount = body.nonTaxableAmount;
              inv.notes = body.notes;
              inv.receiver = body.receiver;
              inv.sender = body.sender;
              inv.shipping = body.shipping;
              inv.subtotal = body.subtotal;
              inv.taxItems = body.taxItems;
              inv.terms = body.terms;
              inv.total = body.total;
            }
          }
          resolve(body.id);
        })
        .catch(err => reject(err));
    });
  }
  deleteInvoice(id: string, index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .delete(`${environment.invoice_url}/${id}`)
        .toPromise()
        .then(() => {
          InvoiceService.invoiceStore.splice(index, 1);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  downloadInvoice(id: string, filename: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .getFile(`${environment.invoice_url}/download/${id}`)
        .toPromise()
        .then(res => {
          this.downLoadFile(res, filename);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  sendInvoice(body:any): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.apiService
        .put(`${environment.invoice_url}/mail`,body)
        .toPromise()
        .then(res => {
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  downLoadFile(data: any, filename?: string) {
    let anchor = document.createElement("a");
    anchor.download = filename ? `${filename}.pdf` : "invoice.pdf";
    let blob = new Blob([data], { type: "application/pdf" });
    anchor.href = window.URL.createObjectURL(blob);
    if (environment.production) {
      // download pdf
      anchor.dataset.downloadurl = [
        "application/pdf",
        anchor.download,
        anchor.href
      ].join(":");
      anchor.click();
    } else {
      window.open(anchor.href);
    }
  }
}
