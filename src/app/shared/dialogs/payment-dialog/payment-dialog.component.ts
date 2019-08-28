import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InvoiceService } from "../../services";
import { Iinvoice } from "../../models";
@Component({
  selector: "app-payment-dialog",
  templateUrl: "./payment-dialog.component.html",
  styleUrls: ["./payment-dialog.component.scss"]
})
export class PaymentDialogComponent implements OnInit {
  title: string;
  paymentForm: FormGroup;
  serverError: string;
  paymentMode: Array<string> = ["Cash", "Cheque", "Credit Card", "Other"];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Iinvoice,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private invoiceService: InvoiceService
  ) {}
  ngOnInit() {
    this.title = "Receive Payment";
    this.paymentForm = this.fb.group({
      receiveDate: [new Date()],
      mode: [this.paymentMode[0]],
      txnid: [null],
      amount: [this.data ? this.data.balanceDue : null, [Validators.required]],
      notes: [null]
    });
  }
  submit(): void {
    this.serverError = "";
    this.paymentForm.value.invoice = this.data.id;
    this.paymentForm.value.customer = this.data.customer;
    this.paymentForm.value.paymentFor = 'invoice';
    if (!this.paymentForm.value.txnid) {
      this.paymentForm.value.txnid = Date.now();
    }
    this.invoiceService.invoicePayment(this.paymentForm.value).then(
      res => this.dialogRef.close(res),
      err => {
        console.log(err);
        this.serverError =
          err.error.message ||
          err.err.msg ||
          "Server Error:- failed to receive payment";
      }
    );
  }
}
