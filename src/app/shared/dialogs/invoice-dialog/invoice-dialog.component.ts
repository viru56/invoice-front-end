import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { InvoiceService } from "../../services";

@Component({
  selector: "app-invoice-dialog",
  templateUrl: "./invoice-dialog.component.html",
  styleUrls: ["./invoice-dialog.component.scss"]
})
export class InvoiceDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private invoiceService: InvoiceService
  ) {}
  invoiceForm: FormGroup;
  serverError: string;
  ngOnInit() {
    this.invoiceForm = this.fb.group({
      to: [this.data.to, [Validators.required, Validators.email]],
      bcc: [""],
      subject: [`Invoice from ${this.data.companyName} #${this.data.number}`],
      message: [
        `A new invoice has been issued on your account: #${
          this.data.number
        }. The balance of Rs ${this.data.balanceDue} is now outstanding.`,
        Validators.required
      ]
    });
  }
  submit(): void {
    this.serverError = "";
    this.invoiceForm.value.id = this.data.id;
    this.invoiceForm.value.userName = this.data.userName;
    if (this.validateEmail(this.invoiceForm.value.bcc)) {
      this.invoiceService
        .sendInvoice(this.invoiceForm.value)
        .then(result => this.dialogRef.close(result))
        .catch(console.log);
    }
  }
  validateEmail(emails: string): boolean {
    this.serverError = "";
    if (!emails.trim()) {
      return true;
    }
    const emailArray = emails.split(",");
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailArray.length <= 5) {
      for (let email of emailArray) {
        if (email && !EMAIL_REGEX.test(email)) {
          this.serverError = "Not a valid email: " + email;
          return false;
        }
      }
    } else {
      this.serverError = "Up to 5 valid emails are allowed";
      return false;
    }
    return true;
  }
}
