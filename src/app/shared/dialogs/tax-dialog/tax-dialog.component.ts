import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TaxService } from "../../services";

@Component({
  selector: "app-tax-dialog",
  templateUrl: "./tax-dialog.component.html",
  styleUrls: ["./tax-dialog.component.scss"]
})
export class TaxDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaxDialogComponent>,
    private taxService: TaxService
  ) {}
  title: string;
  taxForm: FormGroup;
  serverError:string;
  ngOnInit() {
    this.data ? (this.title = "Edit Tax Rate") : (this.title = "New Tax Rate");
    this.taxForm = this.fb.group({
      name: [this.data ? this.data.name : "", [Validators.required]],
      amount: [this.data ? this.data.amount : null, [Validators.required]],
      taxMode: [this.data && this.data.taxMode ==='Inclusive' ? true : false]
    });
  }
  submit(): void {
    this.serverError = '';
    if (this.data) this.taxForm.value.id = this.data.id;
    this.taxForm.value.taxMode = this.taxForm.value.taxMode
      ? "Inclusive"
      : "Exclusive";
    if (this.data) this.taxForm.value.id = this.data.id;
    this.taxService[this.data ? "updateTaxItem" : "addTaxItem"](this.taxForm.value)
      .then(result => {
        this.dialogRef.close(result);
      })
      .catch(err => {
        console.log(err);
        this.serverError =
          err.error.errmsg ||
          err.error.message ||
          "server error: failed to add item";
      });
  }
}
