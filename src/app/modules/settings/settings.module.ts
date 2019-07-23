import { NgModule } from '@angular/core';
import { BaseModule } from '../../base/base.module';
import { SettingsComponent } from './settings.component';
import {Routes, RouterModule} from '@angular/router';

const appRoutes:Routes = [{
  path:'',
  component: SettingsComponent
}]
@NgModule({
  declarations: [SettingsComponent],
  imports: [
    BaseModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class SettingsModule { }
