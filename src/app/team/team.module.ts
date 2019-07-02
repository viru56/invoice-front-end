import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TeamComponent } from "./team.component";
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../base/base.module";

const appRoutes: Routes = [
  {
    path: "",
    component: TeamComponent
  }
];
@NgModule({
  declarations: [TeamComponent],
  imports: [BaseModule,RouterModule.forChild(appRoutes)]
})
export class TeamModule {}
