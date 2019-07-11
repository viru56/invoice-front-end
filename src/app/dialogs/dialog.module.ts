import { NgModule } from '@angular/core';
import { TaxDialogComponent } from './tax-dialog/tax-dialog.component';
import {BaseModule} from '../base/base.module';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
@NgModule({
  declarations: [TaxDialogComponent, ItemDialogComponent],
  imports: [
    BaseModule
  ],
  entryComponents: [
    TaxDialogComponent,
    ItemDialogComponent
  ]
})
export class DialogModule { }
