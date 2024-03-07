import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-home-dialog",
  templateUrl: "./home-dialog.component.html",
  styleUrls: ["./home-dialog.component.scss"]
})
export class HomeDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HomeDialogComponent>
  ) {}
  invoiceForm: FormGroup;
  ngOnInit() {
    this.invoiceForm = this.fb.group({
      from: [
        this.data.mail && this.data.mail.from ? this.data.mail.from : "",
        [Validators.required, Validators.email]
      ],
      to: [
        this.data.mail && this.data.mail.to ? this.data.mail.to : "",
        [Validators.required, Validators.email]
      ],
      subject: [
        this.data.mail && this.data.mail.subject
          ? this.data.mail.subject
          : `Invoice from ${this.data.sender} #${this.data.number}`,
        Validators.required
      ],
      message: [
        this.data.mail && this.data.mail.message
          ? this.data.mail.message
          : "A new invoice has been created on your account. You may find a PDF of your invoice attached.",
        Validators.required
      ]
    });
  }
  submit(): void {
    this.dialogRef.close(this.invoiceForm.value);
  }
}
