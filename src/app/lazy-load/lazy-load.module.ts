import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
const routes: Routes = [   
    {path: 'auth', loadChildren: '../auth/auth.module#AuthModule'},
    {path: 'register', loadChildren: '../register/register.module#RegisterModule'},
   { path: 'login', loadChildren: '../login/login.module#LoginModule'},
   { path: 'forgotpassword', loadChildren: '../forgot-password/forgot-password.module#ForgotPasswordModule'},
   { path: '', loadChildren: '../home/home.module#HomeModule'},
  //  {path: '**', redirectTo: ''}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class LazyLoadModule { }
