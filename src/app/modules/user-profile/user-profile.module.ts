import { NgModule } from '@angular/core';
import { BaseModule } from '../../base/base.module';
import {Routes, RouterModule} from '@angular/router';
import { UserProfileComponent } from './user-profile.component';

const appRoutes:Routes = [{
  path:'',
  component: UserProfileComponent
}]
@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    BaseModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class UserProfileModule { }
