import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";
import { Subscription } from "rxjs";
import { AuthService } from "../shared/services";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = true;
  visibility = "shown";
  mediaWatcher: Subscription;
  sideNavOpened: boolean = true;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;
  sideNavMode: string = "side";

  ngOnChanges() {
    this.visibility = this.isVisible ? "shown" : "hidden";
  }

  constructor(private media: MediaObserver, private authService: AuthService) {}

  ngOnInit() {
    this.mediaWatcher = this.media.media$.subscribe(() => {
      this.toggleView();
    });
  }
  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }

  toggleView() {
    if (this.media.isActive("gt-md")) {
      this.sideNavMode = "side";
      this.sideNavOpened = true;
      this.matDrawerOpened = false;
      this.matDrawerShow = true;
    } else if (this.media.isActive("gt-xs")) {
      this.sideNavMode = "side";
      this.sideNavOpened = false;
      this.matDrawerOpened = true;
      this.matDrawerShow = true;
    } else if (this.media.isActive("lt-sm")) {
      this.sideNavMode = "over";
      this.sideNavOpened = false;
      this.matDrawerOpened = false;
      this.matDrawerShow = false;
    }
  }
}
