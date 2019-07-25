import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

const routes: Routes = [   
    {path: 'auth', loadChildren: '../../auth/auth.module#AuthModule'},
    {path: 'register', loadChildren: '../register/register.module#RegisterModule'},
   { path: 'login', loadChildren: '../login/login.module#LoginModule'},
   { path: 'forgotpassword', loadChildren: '../forgot-password/forgot-password.module#ForgotPasswordModule'},
   {path:'accountactivation',loadChildren:'../account-activation/account-activation.module#AccountActivationModule'},
   {path:'resetpassword',loadChildren:'../reset-password/reset-password.module#ResetPasswordModule'},
   { path: '', loadChildren: '../home/home.module#HomeModule'},
  //  {path: '**', redirectTo: ''}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{useHash:true})
  ]
})
export class LazyLoadModule { }
