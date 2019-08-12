import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IlineItem } from "../models";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root"
})
export class ItemService {
  static itemStore: IlineItem[];
  constructor(private apiService: ApiService) {
  }
  addItem(body: IlineItem): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .post(environment.item_url, body)
        .toPromise()
        .then(item => {
          ItemService.itemStore.push(item);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  getItem(id: string): Observable<IlineItem> {
    return this.apiService.get(`${environment.item_url}/${id}`);
  }
  getItems(): Observable<IlineItem[]> {
    return this.apiService.get(environment.item_url);
  }
  getItemStore():Promise<IlineItem[]> {
    return new Promise((resolve, reject) => {
      if (ItemService.itemStore) {
        resolve(ItemService.itemStore);
      } else {
        this.getItems()
          .toPromise()
          .then(items => {
            ItemService.itemStore = items; // cache item data
            resolve(ItemService.itemStore);
          })
          .catch(error => reject(error));
      }
    });
  }
  updateItem(body: IlineItem): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .put(environment.item_url, body)
        .toPromise()
        .then(() => {
          for (let item of ItemService.itemStore) {
            if (item.id === body.id) {
              item.name = body.name;
              item.description = body.description;
              item.taxable = body.taxable;
              item.unitCost = body.unitCost;
            }
          }
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
  deleteItem(index: number, id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiService
        .delete(`${environment.item_url}/${id}`)
        .toPromise()
        .then(() => {
          ItemService.itemStore.splice(index, 1);
          resolve(true);
        })
        .catch(err => reject(err));
    });
  }
}
