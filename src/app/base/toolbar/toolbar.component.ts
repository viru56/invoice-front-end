import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../../shared/services";
import { Iuser } from "../../shared/models";
import * as moment from "moment";
import { Router } from '@angular/router';
@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  @Input() sidenav;
  @Input() drawer;
  @Input() matDrawerShow;
  subscriptionRemainingDays: number;
  data: { notifications: Array<any>; currentUser: Iuser } = {
    notifications: [
      {
        id: "id",
        title: "This is a test message",
        lastTime: "23 Minutes ago",
        state: "state"
      }
    ],
    currentUser: null
  };
  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit() {
    this.authService.getUserDetails().then(
      user => {
        this.data.currentUser = user;
        this.subscriptionRemainingDays = moment(
          this.data.currentUser.company.subscriptionEndDate
        ).diff(moment(), "days") + 1;
        if(this.subscriptionRemainingDays < 1){
          this.router.navigateByUrl('plan');
        }
      },
      err => console.log(err)
    );
  }
}
