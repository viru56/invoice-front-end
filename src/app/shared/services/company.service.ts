import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Icompany } from "../models";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class CompanyService {
  //static companyStore: Icompany[];
  constructor(private apiService: ApiService) {}
  addCompany(body: Icompany): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.company_url, body)
        .toPromise()
        .then(item => resolve(item))
        .catch(err => reject(err));
    });
  }
  updateCompany(body: Icompany, file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const businessFormData = new FormData();
      businessFormData.append("logo", file);
      businessFormData.append("data", JSON.stringify(body));
      this.apiService
        .putFile(environment.company_url, businessFormData)
        .toPromise()
        .then((data) => {
          if (AuthService.currentUser.company) {
            AuthService.currentUser.company.name = body.name;
            AuthService.currentUser.company.email = body.email;
            AuthService.currentUser.company.logo = data.logoUrl;
            AuthService.currentUser.company.postalCode = body.postalCode;
            AuthService.currentUser.company.sendTo = body.sendTo;
            AuthService.currentUser.company.state = body.state;
            AuthService.currentUser.company.city = body.city;
            AuthService.currentUser.company.subscription = body.subscription;
            AuthService.currentUser.company.subscriptionEndDate =
              body.subscriptionEndDate;
            AuthService.currentUser.company.subscriptionStartDate =
              body.subscriptionStartDate;
            AuthService.currentUser.company.taxId = body.taxId;
          }
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  getComapny(): Observable<Icompany> {
    return this.apiService.get(environment.company_url);
  }
  // getCompanies(): Observable<Icompany[]> {
  //   return this.apiService.get(`${environment.company_url}/all`);
  // }
  // getcompanyStore(): Promise<Icompany[]> {
  //   return new Promise((resolve, reject) => {
  //     if (CompanyService.companyStore) {
  //       resolve(CompanyService.companyStore);
  //     } else {
  //       this.getCompanies()
  //         .toPromise()
  //         .then(items => {
  //           CompanyService.companyStore = items; // cache item data
  //           resolve(CompanyService.companyStore);
  //         })
  //         .catch(error => reject(error));
  //     }
  //   });
  // }

  // deleteCompany(index: number, id: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.apiService
  //       .delete(`${environment.company_url}/${id}`)
  //       .toPromise()
  //       .then(() => {
  //         CompanyService.companyStore.splice(index, 1);
  //         resolve(true);
  //       })
  //       .catch(err => reject(err));
  //   });
  // }
}
