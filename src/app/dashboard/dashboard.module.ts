import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../base/base.module";

const appRoutes: Routes = [
  {
    path: "",
    component: DashboardComponent
  }
];
@NgModule({
  declarations: [DashboardComponent],
  imports: [BaseModule, RouterModule.forChild(appRoutes)]
})
export class DashboardModule {}
