import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../../base/base.module";
import { MyInvoicesComponent } from "./my-invoices.component";

const appRoutes: Routes = [
  {
    path: "",
    component: MyInvoicesComponent
  }
];

@NgModule({
  declarations: [MyInvoicesComponent],
  imports: [BaseModule, RouterModule.forChild(appRoutes)]
})
export class MyInvoicesModule {}
