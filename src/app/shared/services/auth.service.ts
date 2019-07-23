import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private apiService: ApiService) {}
  createAccount(path: string, body: any): Observable<any> {
    return this.apiService.post(path, body);
  }
  accountActivation(
    path: string,
    body: { password: string; token: string }
  ): Observable<any> {
    return this.apiService.put(path, body);
  }
}
