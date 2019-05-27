import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import {Routes, RouterModule} from '@angular/router';

const appRoutes:Routes = [{
  path:'',
  component: CustomersComponent
}]
@NgModule({
  declarations: [CustomersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class CustomersModule { }
