import { NgModule } from '@angular/core';
import { BaseModule } from '../../base/base.module';
import { CustomersComponent } from './customers.component';
import {Routes, RouterModule} from '@angular/router';

const appRoutes:Routes = [{
  path:'',
  component: CustomersComponent
}]
@NgModule({
  declarations: [CustomersComponent],
  imports: [
    BaseModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class CustomersModule { }
