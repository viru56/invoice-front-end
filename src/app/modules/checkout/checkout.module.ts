import { NgModule } from "@angular/core";
import { CheckoutComponent } from "./checkout.component";
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../../base/base.module";

const appRoutes: Routes = [
  {
    path: "",
    component: CheckoutComponent
  }
];
@NgModule({
  declarations: [CheckoutComponent],
  imports: [BaseModule, RouterModule.forChild(appRoutes)]
})
export class CheckoutModule {}
