import { NgModule } from "@angular/core";
import { BaseModule } from "../../base/base.module";
import { Routes, RouterModule } from "@angular/router";
import { AccountActivationComponent } from "./account-activation.component";
const appRoutes: Routes = [
  {
    path: "",
    component: AccountActivationComponent
  }
];
@NgModule({
  declarations: [AccountActivationComponent],
  imports: [RouterModule.forChild(appRoutes), BaseModule]
})
export class AccountActivationModule {}
