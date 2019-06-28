import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../base/base.module";

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent
  }
];
@NgModule({
  declarations: [HomeComponent],
  imports: [RouterModule.forChild(appRoutes), BaseModule]
})
export class HomeModule {}
