import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  private setHeaders(): HttpHeaders {
    const headerConfig = {
      "Content-type": "application/json",
      Accept: "application/json"
    };

    if (this.cookieService.check("authorization")) {
      headerConfig["Authorization"] = this.cookieService.get("authorization");
    }
    if (this.router.parseUrl(this.router.url).queryParams.token) {
      headerConfig["Authorization"] = this.router.parseUrl(
        this.router.url
      ).queryParams.token;
    }
    return new HttpHeaders(headerConfig);
  }

  get(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl, {
      headers: this.setHeaders()
    });
  }
  post(apiUrl: string, body: Object = {}): Observable<any> {
    return this.http.post(apiUrl, JSON.stringify(body), {
      headers: this.setHeaders()
    });
  }
  put(apiUrl: string, body: Object = {}): Observable<any> {
    return this.http.put(apiUrl, JSON.stringify(body), {
      headers: this.setHeaders()
    });
  }
  delete(apiUrl): Observable<any> {
    return this.http.delete(apiUrl, {
      headers: this.setHeaders()
    });
  }
  upload(apiUrl: string, body: FormData,responseType:any='arraybuffer'): Observable<any> {
    return this.http.post(apiUrl, body,{responseType: responseType});
  }
}
