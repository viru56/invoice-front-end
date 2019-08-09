import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Itax } from "../models";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class TaxService {
  private taxStore: Itax[];
  constructor(private apiService: ApiService) {
    this.taxStore = null;
  }
  addTaxItem(body: Itax): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.tax_url, body)
        .toPromise()
        .then(item => {
          this.taxStore.push(item);
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
      if (this.taxStore) {
        resolve(this.taxStore);
      } else {
        this.getTaxItems()
          .toPromise()
          .then(items => {
            this.taxStore = items; // cache item data
            resolve(this.taxStore);
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
          for (let item of this.taxStore) {
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
          this.taxStore.splice(index, 1);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
}
