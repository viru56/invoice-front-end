import { Component, OnInit } from "@angular/core";
import { AuthService, PaymentService } from "src/app/shared/services";
import { Iuser } from "src/app/shared/models";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.scss"]
})
export class PlanComponent implements OnInit {
  currentUser: Iuser;
  plans: Array<any> = [
    {
      name: "Monthly",
      amount: 1000,
      description:
        " The plan for businesses that need simple online invoicing.",
      customerIncludes: "Unlimited",
      userIncludes: "Unlimited",
      features: [
        " Create and send invoices",
        " PayPal payments",
        "  Email Support",
        "  Roles and Permissions"
      ]
    },
    {
      name: "Yearly",
      amount: 10000,
      description:
        " The plan for businesses that need simple online invoicing.",
      customerIncludes: "Unlimited",
      userIncludes: "Unlimited",
      features: [
        " Create and send invoices",
        " PayPal payments",
        "  Email Support",
        "  Roles and Permissions"
      ]
    }
  ];
  planExpired: boolean;
  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUserDetails().then(user => {
      this.currentUser = user;
      this.planExpired =
        moment(this.currentUser.company.subscriptionEndDate) > moment();
    }, console.log);
  }
  doPayment(plan: string): void {
    this.router.navigateByUrl(`checkout/${plan}`);
  }
  logout(): void {
    this.authService.logout();
  }
}
