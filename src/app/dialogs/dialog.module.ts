import { NgModule } from '@angular/core';
import { TaxDialogComponent } from './tax-dialog/tax-dialog.component';
import {BaseModule} from '../base/base.module';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';
@NgModule({
  declarations: [TaxDialogComponent, ItemDialogComponent, CustomerDialogComponent, InvoiceDialogComponent],
  imports: [
    BaseModule
  ],
  entryComponents: [
    TaxDialogComponent,
    ItemDialogComponent,
    CustomerDialogComponent
  ]
})
export class DialogModule { }
