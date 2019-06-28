import { NgModule } from "@angular/core";
import { BaseModule } from "../base/base.module";
import { LoginComponent } from "./login.component";

import { Routes, RouterModule } from "@angular/router";

const appRoutes: Routes = [
  {
    path: "",
    component: LoginComponent
  }
];
@NgModule({
  declarations: [LoginComponent],
  imports: [BaseModule, RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class LoginModule {}
