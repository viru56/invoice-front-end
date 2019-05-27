import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';

const routes: Routes = [   
    {path: 'auth', loadChildren: '../auth/auth.module#AuthModule'},
    {path: 'register', loadChildren: '../register/register.module#RegisterModule'},
   { path: 'login', loadChildren: '../login/login.module#LoginModule'},
    {path: '**', redirectTo: 'auth/dashboard'}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class LazyLoadModule { }
