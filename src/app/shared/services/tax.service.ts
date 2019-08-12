import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Itax } from "../models";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class TaxService {
  static taxStore: Itax[];
  constructor(private apiService: ApiService) {
  }
  addTaxItem(body: Itax): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.tax_url, body)
        .toPromise()
        .then(item => {
          TaxService.taxStore.push(item);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  getTaxItem(id: string): Observable<Itax> {
    return this.apiService.get(`${environment.tax_url}/${id}`);
  }
  getTaxItems(): Observable<Itax[]> {
    return this.apiService.get(environment.tax_url);
  }
  getTaxStore(): Promise<Itax[]> {
    return new Promise((resolve, reject) => {
      if (TaxService.taxStore) {
        resolve(TaxService.taxStore);
      } else {
        this.getTaxItems()
          .toPromise()
          .then(items => {
            TaxService.taxStore = items; // cache item data
            resolve(TaxService.taxStore);
          })
          .catch(error => reject(error));
      }
    });
  }
  updateTaxItem(body: Itax): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .put(environment.tax_url, body)
        .toPromise()
        .then(() => {
          for (let item of TaxService.taxStore) {
            if (item.id === body.id) {
              item.name = body.name;
              item.amount = body.amount;
              item.taxMode = body.taxMode;
            }
          }
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  deleteTaxItem(index: number, id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .delete(`${environment.tax_url}/${id}`)
        .toPromise()
        .then(() => {
          TaxService.taxStore.splice(index, 1);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
}
