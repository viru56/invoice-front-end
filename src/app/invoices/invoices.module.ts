import { NgModule } from "@angular/core";
import { BaseModule } from "../base/base.module";
import { InvoicesComponent } from "./invoices.component";
import { Routes, RouterModule } from "@angular/router";

const appRoutes: Routes = [
  {
    path: "",
    component: InvoicesComponent
  }
];
@NgModule({
  declarations: [InvoicesComponent],
  imports: [BaseModule, RouterModule.forChild(appRoutes)]
})
export class InvoicesModule {}
