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
      from: ["", [Validators.required, Validators.email]],
      to: ["", [Validators.required, Validators.email]],
      subject: [
        {
          value: `Invoice from ${this.data.sender} #${this.data.number}`,
          disabled: true
        }
      ],
      message: [
        "A new invoice has been created on your account. You may find a PDF of your invoice attached.",
        Validators.required
      ]
    });
  }
  submit(): void {
    this.invoiceForm.value.subject = `Invoice from ${this.data.sender} #${
      this.data.number
    }`;
    this.dialogRef.close(this.invoiceForm.value);
  }
}
