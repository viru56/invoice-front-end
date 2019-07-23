import { NgModule } from '@angular/core';
import { BaseModule } from '../../base/base.module';
import { PaymentsComponent } from './payments.component';
import {Routes, RouterModule} from '@angular/router';

const appRoutes:Routes = [{
  path:'',
  component: PaymentsComponent
}]
@NgModule({
  declarations: [PaymentsComponent],
  imports: [
    BaseModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class PaymentsModule { }
