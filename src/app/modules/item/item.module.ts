import { NgModule } from '@angular/core';
import { ItemComponent } from './item.component';
import { Routes, RouterModule } from "@angular/router";
import { BaseModule } from "../../base/base.module";

const appRoutes: Routes = [
  {
    path: "",
    component: ItemComponent
  }
];
@NgModule({
  declarations: [ItemComponent],
  imports: [
   BaseModule, RouterModule.forChild(appRoutes)
  ]
})
export class ItemModule { }
