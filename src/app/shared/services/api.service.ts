import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private setHeaders(): HttpHeaders {
    const headerConfig = {
      "Content-type": "application/json",
      Accept: "application/json"
    };

    // if (this.jwtService.getToken()) {
    //     headerConfig['Authorization'] = `Bearer ${this.jwtService.getToken()}`;
    // }
    return new HttpHeaders(headerConfig);
  }

  get(path: string): Observable<any> {
    return this.http.get(`${environment.base_url}${path}`, {
      headers: this.setHeaders()
    });
  }
  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.base_url}${path}`,
      JSON.stringify(body),
      {
        headers: this.setHeaders()
      }
    );
  }
  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.base_url}${path}`,
      JSON.stringify(body),
      {
        headers: this.setHeaders()
      }
    );
  }
  delete(path): Observable<any> {
    return this.http.delete(`${environment.base_url}${path}`, {
      headers: this.setHeaders()
    });
  }
}
