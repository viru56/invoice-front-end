import { NgModule } from "@angular/core";
import { TaxDialogComponent } from "./tax-dialog/tax-dialog.component";
import { BaseModule } from "../../base/base.module";
import { ItemDialogComponent } from "./item-dialog/item-dialog.component";
import { CustomerDialogComponent } from "./customer-dialog/customer-dialog.component";
import { InvoiceDialogComponent } from "./invoice-dialog/invoice-dialog.component";
import { TeamDialogComponent } from "./team-dialog/team-dialog.component";
import { HomeDialogComponent } from './home-dialog/home-dialog.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
@NgModule({
  declarations: [
    TaxDialogComponent,
    ItemDialogComponent,
    CustomerDialogComponent,
    InvoiceDialogComponent,
    TeamDialogComponent,
    HomeDialogComponent,
    PaymentDialogComponent
  ],
  imports: [BaseModule],
  entryComponents: [
    TaxDialogComponent,
    ItemDialogComponent,
    CustomerDialogComponent,
    TeamDialogComponent,
    InvoiceDialogComponent,
    HomeDialogComponent,
    PaymentDialogComponent
  ]
})
export class DialogModule {}
