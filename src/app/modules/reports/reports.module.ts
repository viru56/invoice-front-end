import { NgModule } from '@angular/core';
import { BaseModule } from '../../base/base.module';
import { ReportsComponent } from './reports.component';
import {Routes, RouterModule} from '@angular/router';

const appRoutes:Routes = [{
  path:'',
  component: ReportsComponent
}]
@NgModule({
  declarations: [ReportsComponent],
  imports: [
    BaseModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class ReportsModule { }
