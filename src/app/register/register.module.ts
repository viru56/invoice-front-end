import { NgModule } from "@angular/core";
import { RegisterComponent } from "./register.component";
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../base/base.module";
const appRoutes: Routes = [
  {
    path: "",
    component: RegisterComponent
  }
];
@NgModule({
  declarations: [RegisterComponent],
  imports: [BaseModule, RouterModule.forChild(appRoutes)]
})
export class RegisterModule {}
