import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxComponent } from './tax.component';
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../../base/base.module";

const appRoutes: Routes = [
  {
    path: "",
    component: TaxComponent
  }
];
@NgModule({
  declarations: [TaxComponent],
  imports: [
    BaseModule, RouterModule.forChild(appRoutes)
  ]
})
export class TaxModule { }
