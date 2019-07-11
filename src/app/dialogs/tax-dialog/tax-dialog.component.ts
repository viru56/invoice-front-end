import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-tax-dialog",
  templateUrl: "./tax-dialog.component.html",
  styleUrls: ["./tax-dialog.component.scss"]
})
export class TaxDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaxDialogComponent>
  ) {}
  title: string;
  taxForm: FormGroup;
  ngOnInit() {
    this.data
      ? (this.title = "Update Tax Rate")
      : (this.title = "New Tax Rate");
    this.taxForm = this.fb.group({
      name: [this.data ? this.data.name : "", [Validators.required]],
      amount: [this.data ? this.data.amount : null, [Validators.required]],
      taxMode: [this.data ? this.data.taxMode : false]
    });
  }
  submit(): void {
    if(this.data){
      this.taxForm.value.id = this.data.id;
    }
    this.dialogRef.close(this.taxForm.value);
  }
}
