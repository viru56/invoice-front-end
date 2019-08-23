import { NgModule } from "@angular/core";
import { BaseModule } from "../../base/base.module";
import { InvoicesComponent } from "./invoices.component";
import { Routes, RouterModule } from "@angular/router";
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';

const appRoutes: Routes = [
  {
    path: "",
    component: InvoicesComponent
  },
  {
    path: "new/:invoiceNumber",
    component: NewInvoiceComponent
  },
  {
    path: "edit/:id",
    component: NewInvoiceComponent
  },
  {
    path: "duplicate/:id/:invoiceNumber",
    component: NewInvoiceComponent
  }
];
@NgModule({
  declarations: [InvoicesComponent, NewInvoiceComponent],
  imports: [BaseModule, RouterModule.forChild(appRoutes)]
})
export class InvoicesModule {}
