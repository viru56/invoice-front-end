import { Component, OnInit } from "@angular/core";
import { AuthService, CompanyService } from "src/app/shared/services";
import { Iuser } from "src/app/shared/models";
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.scss"]
})
export class PlanComponent implements OnInit {
  currentUser: Iuser;
  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    private toastr:ToastrService,
    private router: Router
  ) {}
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
  ngOnInit() {
    this.authService
      .getUserDetails()
      .then(user => (this.currentUser = user), console.log);
  }
  doPayment(plan: string): void {
    let subscriptionEndDate = moment();
   if(plan.toLowerCase()=="monthly"){
    subscriptionEndDate.add(1,'M');
    if(moment(this.currentUser.company.subscriptionEndDate) > moment()){
      subscriptionEndDate = moment(this.currentUser.company.subscriptionEndDate).add(1,'M');
    }
   }else{
    subscriptionEndDate.add(1,'y');
   }
   this.currentUser.company.subscription = plan;
   this.currentUser.company.subscriptionEndDate = new Date(subscriptionEndDate.toString());
   this.companyService.updateCompany(this.currentUser.company).then(res=>{
    this.toastr.success('Suscription is renewed!');
  this.router.navigateByUrl('auth/dashboard');
   },console.log)
  }
  logout(): void {
    this.authService.logout();
  }
}
