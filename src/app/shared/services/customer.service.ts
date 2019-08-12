import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Icustomer } from "../models";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class CustomerService {
  static customerStore: Icustomer[];
  constructor(private apiService: ApiService) {
  }
  addNewCustomer(body: Icustomer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.customer_url, body)
        .toPromise()
        .then(item => {
          CustomerService.customerStore.push(item);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  getCustomer(id: string): Observable<Icustomer> {
    return this.apiService.get(`${environment.customer_url}/${id}`);
  }
  getCustomers(): Observable<Icustomer[]> {
    return this.apiService.get(environment.customer_url);
  }
  getcustomerStore(): Promise<Icustomer[]> {
    return new Promise((resolve, reject) => {
      if (CustomerService.customerStore) {
        resolve(CustomerService.customerStore);
      } else {
        this.getCustomers()
          .toPromise()
          .then(items => {
            CustomerService.customerStore = items; // cache item data
            resolve(CustomerService.customerStore);
          })
          .catch(error => reject(error));
      }
    });
  }
  updateCustomer(body: Icustomer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .put(environment.customer_url, body)
        .toPromise()
        .then(() => {
          for (let item of CustomerService.customerStore) {
            if (item.id === body.id) {
              item.fullName = body.fullName;
              item.accountId = body.accountId;
              item.address_1 = body.address_1;
              item.address_2 = body.address_2;
              item.attentionTo = body.attentionTo;
              item.city = body.city;
              item.country = body.country;
              item.email = body.email;
              item.notes = body.notes;
              item.phone = body.phone;
              item.postalCode = body.postalCode;
              item.state = body.state;
            }
          }
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  deleteCustomer(index: number, id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .delete(`${environment.customer_url}/${id}`)
        .toPromise()
        .then(() => {
          CustomerService.customerStore.splice(index, 1);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
}
