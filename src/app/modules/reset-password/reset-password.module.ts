import { NgModule } from '@angular/core';
import { BaseModule } from "../../base/base.module";
import { Routes, RouterModule } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password.component";
const appRoutes: Routes = [
  {
    path: "",
    component: ResetPasswordComponent
  }
];
@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    BaseModule, RouterModule.forChild(appRoutes)
  ]
})
export class ResetPasswordModule { }
