import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";

import { CookieService } from "ngx-cookie-service";
@Injectable({
  providedIn: "root"
})
export class NoAuthGuard implements CanActivate {
  constructor(private cookieService: CookieService) {}
  canActivate(): boolean {
    return !this.cookieService.check("authorization");
  }
}
