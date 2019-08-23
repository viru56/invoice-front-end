import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { Iuser } from "../models";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  static currentUser: Iuser;
  static userStore: Iuser[];
  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) {}
  addNewUser(body: {
    fullName: string;
    email: string;
    role: string;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.user_url, body)
        .toPromise()
        .then(item => {
          AuthService.userStore.push(item);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  userRoleUpdate(body: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .put(`${environment.user_url}/role`, body)
        .toPromise()
        .then(item => {
          for (let item of AuthService.userStore) {
            if (item.id === body.id) {
              item.role = body.role;
            }
          }
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  deleteUser(index: number, id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .delete(`${environment.user_url}/${id}`)
        .toPromise()
        .then(() => {
          AuthService.userStore.splice(index, 1);
          resolve(true);
        })
        .catch(err => reject(err));
    });
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
    this.router.navigateByUrl("/login");
  }

  getUser(): Observable<Iuser> {
    return this.apiService.get(`${environment.user_url}`);
  }
  getUserDetails(): Promise<Iuser> {
    return new Promise((resolve, reject) => {
      if (AuthService.currentUser) {
        resolve(AuthService.currentUser);
      } else {
        this.getUser()
          .toPromise()
          .then(user => {
            if(user){
              AuthService.currentUser = user;
              resolve(user);
            }else {
             this.logout();
            }
          })
          .catch(err => {
            reject(err);
            this.logout();
          });
      }
    });
  }

  getUsers(): Observable<Iuser[]> {
    return this.apiService.get(`${environment.user_url}/all`);
  }
  getUserStore(): Promise<Iuser[]> {
    return new Promise((resolve, reject) => {
      if (AuthService.userStore) {
        resolve(AuthService.userStore);
      } else {
        this.getUsers()
          .toPromise()
          .then(items => {
            AuthService.userStore = items; // cache item data
            resolve(AuthService.userStore);
          })
          .catch(error => reject(error));
      }
    });
  }
}
