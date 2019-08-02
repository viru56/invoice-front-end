import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard, NoAuthGuard } from "../../shared/guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: "../../auth/auth.module#AuthModule",
    canActivate: [AuthGuard]
  },
  {
    path: "register",
    loadChildren: "../register/register.module#RegisterModule"
  },
  {
    path: "login",
    loadChildren: "../login/login.module#LoginModule",
    canActivate: [NoAuthGuard]
  },
  {
    path: "forgotpassword",
    loadChildren:
      "../forgot-password/forgot-password.module#ForgotPasswordModule",
    canActivate: [NoAuthGuard]
  },
  {
    path: "accountactivation",
    loadChildren:
      "../account-activation/account-activation.module#AccountActivationModule",
    canActivate: [NoAuthGuard]
  },
  {
    path: "resetpassword",
    loadChildren: "../reset-password/reset-password.module#ResetPasswordModule",
    canActivate: [NoAuthGuard]
  },
  {
    path: "",
    loadChildren: "../home/home.module#HomeModule",
   canActivate: [NoAuthGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { useHash: true })]
})
export class LazyLoadModule {}
