import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { IlineItem } from "../models";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root"
})
export class ItemService {
  private itemStore: IlineItem[];
  constructor(private apiService: ApiService) {
    this.itemStore = null;
  }
  addItem(body: IlineItem): Observable<IlineItem> {
    this.itemStore = null; // delete the store so next time it fetch updated data
    return this.apiService.post(environment.item_url, body);
  }
  getItem(id: string): Observable<IlineItem> {
    return this.apiService.get(`${environment.item_url}/${id}`);
  }
  getItems(): Observable<IlineItem[]> {
    return this.apiService.get(environment.item_url);
  }
  getItemStore(callback) {
    if (this.itemStore) {
      callback(null, this.itemStore);
    } else {
      this.getItems()
        .toPromise()
        .then(items => {
          this.itemStore = items; // cache item data
          callback(null, items);
        })
        .catch(err => callback(err, null));
    }
  }
  updateItem(body: IlineItem): Observable<any> {
    this.itemStore = null; // delete the store so next time it fetch updated data
    return this.apiService.put(environment.item_url, body);
  }
  deleteItem(id: string): Observable<any> {
    this.itemStore = null; // delete the store so next time it fetch updated data
    return this.apiService.delete(`${environment.item_url}/${id}`);
  }
}
