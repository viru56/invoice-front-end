import { NgModule } from "@angular/core";
import { ForgotPasswordComponent } from "./forgot-password.component";
import { BaseModule } from "../base/base.module";
import { Routes, RouterModule } from "@angular/router";
const appRoutes: Routes = [
  {
    path: "",
    component: ForgotPasswordComponent
  }
];
@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [RouterModule.forChild(appRoutes), BaseModule]
})
export class ForgotPasswordModule {}
