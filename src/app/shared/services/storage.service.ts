import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  constructor() {}
  getItem(key: string) {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    } else {
      return null;
    }
  }
  setItem(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  clear() {
    window.localStorage.clear();
  }
  removeItem(key: string) {
    window.localStorage.removeItem(key);
  }
}
