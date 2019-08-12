import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import {
  Router,
} from "@angular/router";
import { Location } from "@angular/common";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "ind-invoice";
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private location: Location
  ) {}
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
  ngOnInit(): void {
    if (this.cookieService.check("authorization")) {
      this.location.path()
        ? this.router.navigateByUrl(this.location.path())
        : this.router.navigateByUrl("/auth/dashboard");
    }
  }
}
