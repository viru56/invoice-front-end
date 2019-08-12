import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Icustomer } from "../../models";
import { CustomerService } from "../../services";
@Component({
  selector: "app-customer-dialog",
  templateUrl: "./customer-dialog.component.html",
  styleUrls: ["./customer-dialog.component.scss"]
})
export class CustomerDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Icustomer,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerDialogComponent>,
    private customerService: CustomerService
  ) {}
  title: string;
  customerForm: FormGroup;
  serverError: string;
  ngOnInit() {
    this.data && this.data.id
      ? (this.title = "Edit Customer")
      : (this.title = "New Customer");
    this.customerForm = this.fb.group({
      fullName: [this.data ? this.data.fullName : "", [Validators.required]],
      email: [this.data ? this.data.email : "", [Validators.required]],
      accountId: [`CUST-000${this.data.accountId}`],
      taxId: [this.data ? this.data.taxId : null, [Validators.required]],
      notes: [this.data ? this.data.notes : ""],
      attentionTo: [this.data && this.data ? this.data.attentionTo : ""],
      phone: [this.data && this.data ? this.data.phone : null],
      address_1: [this.data && this.data ? this.data.address_1 : ""],
      address_2: [this.data && this.data ? this.data.address_2 : ""],
      city: [this.data && this.data ? this.data.city : ""],
      state: [this.data && this.data ? this.data.state : ""],
      country: [this.data && this.data ? this.data.country : "India"],
      postalCode: [this.data && this.data ? this.data.postalCode : null]
    });
  }
  submit(): void {
    this.serverError = "";
    if (this.data) this.customerForm.value.id = this.data.id;
    this.customerForm.value.accountId = this.data.accountId;
    this.customerService[this.data && this.data.id ? "updateCustomer" : "addNewCustomer"](
      this.customerForm.value
    )
      .then(result => {
        this.dialogRef.close(result);
      })
      .catch(err => {
        console.log(err);
        this.serverError =
          err.error.errmsg ||
          err.error.message ||
          "server error: failed to add item";
        console.log(this.serverError);
      });
  }
}
