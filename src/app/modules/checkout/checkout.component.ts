import { Component, OnInit } from "@angular/core";
import * as dropin from "braintree-web-drop-in";
import { environment } from "src/environments/environment";
import { PaymentService } from "src/app/shared/services";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
  checkoutUrl: string = `${environment.payment_url}/checkout`;
  amount: number;
  plan: string;
  nonce: string;
  dropinInstance: any;
  showLoader: boolean;
  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.showLoader = true;
    this.route.paramMap.subscribe(params => {
      this.plan = params.has("plan") ? params.get("plan") : "";
      if (this.plan.toLowerCase() === "monthly") {
        this.amount = 1000;
      } else if (this.plan.toLowerCase() === "yearly") {
        this.amount = 10000;
      } else {
        this.toastr.error("Somthing bad happened", "please try again");
        this.router.navigateByUrl("plan");
      }
      this.createPaymentForm();
    });
  }
  createPaymentForm(): void {
    dropin.create(
      {
        authorization: environment.tokenizationKeys,
        container: "#dropin-container"
      },
      (createErr, instance) => {
        if (instance) {
          this.dropinInstance = instance;
          this.showLoader = false;
        }
        if (createErr) console.log(createErr);
      }
    );
  }
  checkout(): void {
    if (this.dropinInstance) {
      this.dropinInstance.requestPaymentMethod((err, payload) => {
        if (err) {
          console.log("Error", err);
          return;
        } else {
          payload.subscription = this.plan;
          payload.paymentFor = "subscription";
          payload.mode = "Credit Card";
          this.paymentService
            .checkout(payload)
            .then(() => {
              this.destroyDropin();
              this.router.navigateByUrl("auth/dashboard");
            })
            .catch(err => {
              console.log(err);
              this.toastr.error("please try again", "Payment failed");
            });
        }
      });
    } else {
      this.toastr.error("please try later", "Server error");
    }
  }
  destroyDropin() {
    this.dropinInstance.teardown(function(err) {
      if (err) {
        console.error("An error occurred during teardown:", err);
      }
    });
  }
}
