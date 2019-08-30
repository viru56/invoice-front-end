import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
@Injectable({
  providedIn: "root"
})
export class PaymentService {
  constructor(private apiService: ApiService) {}
  paymentToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .get(`${environment.payment_url}/token`)
        .toPromise()
        .then(token => resolve(token))
        .catch(err => reject(err));
    });
  }
  checkout(body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(`${environment.payment_url}/checkout`, body)
        .toPromise()
        .then(res => {
          if(AuthService.currentUser){
            AuthService.currentUser.company.subscriptionEndDate = res.subscriptionEndDate;
            AuthService.currentUser.company.subscription = res.subscription;

          }
          resolve(res)})
        .catch(err => reject(err));
    });
  }
}
