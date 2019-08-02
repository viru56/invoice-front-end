import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "./shared/services";
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError
} from "@angular/router";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "ind-invoice";
  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router
  ) {}
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
  ngOnInit(): void {
    if (this.cookieService.check("authorization")) {
      this.router.navigateByUrl('/auth/dashboard');
    }
  }
}
