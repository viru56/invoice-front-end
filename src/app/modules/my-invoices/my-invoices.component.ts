import { Component, OnInit } from "@angular/core";
import { StorageService } from "src/app/shared/services";
import { Iinvoice } from "src/app/shared/models";

@Component({
  selector: "app-my-invoices",
  templateUrl: "./my-invoices.component.html",
  styleUrls: ["./my-invoices.component.scss"]
})
export class MyInvoicesComponent implements OnInit {
  constructor(private storageService: StorageService) {}
  invoices: Iinvoice[];
  l_invoicesIds: Array<number>;
  ngOnInit() {
    this.invoices = [];
    this.l_invoicesIds = this.storageService.getItem("l_invoicesIds");
    this.loadInvoices();
  }
  loadInvoices(){
    if (this.l_invoicesIds.length > 0) {
      for (let id of this.l_invoicesIds) {
        const invoice = this.storageService.getItem(`l_invoice-${id}`);
        if (invoice) this.invoices.push(invoice);
      }
    }
  }
  deleteInvoice(number: number,index:number) {
    this.l_invoicesIds.splice(this.l_invoicesIds.indexOf(number), 1);
    this.storageService.setItem('l_invoicesIds',this.l_invoicesIds);
    this.storageService.removeItem(`l_invoice-${number}`);
    this.invoices.splice(index,1);
  }
}
