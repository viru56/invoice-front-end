import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Itax } from "../../models";
@Component({
  selector: "app-item-dialog",
  templateUrl: "./item-dialog.component.html",
  styleUrls: ["./item-dialog.component.scss"]
})
export class ItemDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemDialogComponent>
  ) {}
  title: string;
  itemForm: FormGroup;
  taxList: Itax[] = [
    { id: 1, name: "C GST", amount: 5, taxMode: false },
    { id: 2, name: "G GST", amount: 5, taxMode: false },
    { id: 3, name: "service tax", amount: 8, taxMode: true }
  ];
  ngOnInit() {
    this.data ? (this.title = "Update Item") : (this.title = "New Item");

    this.itemForm = this.fb.group({
      name: [this.data ? this.data.name : "", [Validators.required]],
      type: [this.data ? this.data.type : "None"],
      description: [this.data ? this.data.description : ""],
      unitCost: [this.data ? this.data.unitCost : null, [Validators.required]],
      taxable: [this.data ? this.data.taxable : true],
      taxIds: [this.data ? this.data.taxIds : null]
    });
  }
  submit(): void {
    this.itemForm.value.taxRate = "";
    if (this.itemForm.value.taxIds && this.itemForm.value.taxIds.length > 0) {
      this.itemForm.value.taxIds.forEach((item, index) => {
        for (let tax of this.taxList) {
          if (tax.id === item) {
            this.itemForm.value.taxRate += `${tax.name} + ${tax.amount}%`;
          }
        }
        if (index + 1 !== this.itemForm.value.taxIds.length) {
          this.itemForm.value.taxRate += ", ";
        }
      });
    }
    if(this.data){
      this.itemForm.value.id = this.data.id;
    }
    this.dialogRef.close(this.itemForm.value);
  }
}
