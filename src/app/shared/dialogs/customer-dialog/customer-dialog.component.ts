import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Icustomer } from "../../models";
@Component({
  selector: "app-customer-dialog",
  templateUrl: "./customer-dialog.component.html",
  styleUrls: ["./customer-dialog.component.scss"]
})
export class CustomerDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Icustomer,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerDialogComponent>
  ) {}
  title: string;
  customerForm: FormGroup;
  ngOnInit() {
    this.data ? (this.title = "Edit Customer") : (this.title = "New Customer");

    this.customerForm = this.fb.group({
      name: [this.data ? this.data.name : "", [Validators.required]],
      email: [this.data ? this.data.email : "", [Validators.required]],
      account: [this.data ? this.data.account : ""],
      taxId: [this.data ? this.data.taxId : null, [Validators.required]],
      notes: [this.data ? this.data.notes : ""],
      attentionTo: [
        this.data && this.data.address ? this.data.address.attentionTo : ""
      ],
      phone: [this.data && this.data.address ? this.data.address.phone : null],
      address_1: [
        this.data && this.data.address ? this.data.address.address_1 : ""
      ],
      address_2: [
        this.data && this.data.address ? this.data.address.address_2 : ""
      ],
      city: [this.data && this.data.address ? this.data.address.city : ""],
      state: [this.data && this.data.address ? this.data.address.state : ""],
      country: [
        this.data && this.data.address ? this.data.address.country : "India"
      ],
      postalCode: [
        this.data && this.data.address ? this.data.address.postalCode : null
      ]
    });
  }
  submit(): void {
    this.customerForm.value.address = {
      attentionTo: this.customerForm.value.attentionTo,
      address_1: this.customerForm.value.address_1,
      address_2: this.customerForm.value.address_2,
      phone: this.customerForm.value.phone,
      city: this.customerForm.value.city,
      state: this.customerForm.value.state,
      country: this.customerForm.value.country,
      postalCode: this.customerForm.value.postalCode
    };
    console.log(this.customerForm.value);
    if (this.data) {
      this.customerForm.value.id = this.data.id;
    }
    this.dialogRef.close(this.customerForm.value);
  }
}
