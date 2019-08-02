import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { CookieService } from "ngx-cookie-service";
import { Observable, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Iuser } from "../models";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  static currentUser: Iuser;
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) {}
  registerCompany(body: any): Observable<any> {
    return this.apiService.post(`${environment.company_url}`, body);
  }
  accountActivation(body: { password: string }): Observable<any> {
    return this.apiService.put(
      `${environment.user_url}/accountactivation`,
      body
    );
  }
  sentforgotPasswordMail(body: { email: string }): Observable<any> {
    return this.apiService.post(
      `${environment.api_url}/sendforgotpasswordmail`,
      body
    );
  }
  resetPassword(body: { password: string }): Observable<any> {
    return this.apiService.put(`${environment.user_url}/forgotpassword`, body);
  }
  login(body: { email: string; password: string }): Observable<any> {
    return this.apiService.post(`${environment.api_url}/login`, body).pipe(
      tap(
        // save token
        data => {
          this.cookieService.set("authorization", data.token);
          AuthService.currentUser = data.user;
        }
      )
    );
  }
  logout() {
    this.cookieService.deleteAll();
  }

  getUserDetails(): Observable<Iuser> {
    if (AuthService.currentUser) {
      return new Observable(observer => observer.next(AuthService.currentUser));
    } else {
      return this.apiService
        .get(`${environment.user_url}/details`)
        .pipe(tap(user => (AuthService.currentUser = user)));
    }
  }
}
