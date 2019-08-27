import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { PlanComponent } from './plan.component';
import { BaseModule } from '../../base/base.module';

const appRoutes:Routes = [{
  path:'',
  component: PlanComponent
}]
@NgModule({
  declarations: [PlanComponent],
  imports: [
    BaseModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class PlanModule { }
