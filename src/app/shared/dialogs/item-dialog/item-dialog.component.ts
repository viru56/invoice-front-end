import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ItemService } from "../../services";
import { Subscription } from "rxjs";
@Component({
  selector: "app-item-dialog",
  templateUrl: "./item-dialog.component.html",
  styleUrls: ["./item-dialog.component.scss"]
})
export class ItemDialogComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemDialogComponent>,
    private itemService: ItemService
  ) {}
  title: string;
  itemForm: FormGroup;
  itemSubscription: Subscription;
  Types: string[] = ["Product", "Service", "Shipping"];
  serverError: string;
  ngOnInit() {
    this.data ? (this.title = "Edit Item") : (this.title = "New Item");

    this.itemForm = this.fb.group({
      name: [this.data ? this.data.name : "", [Validators.required]],
      // type: [this.data ? this.data.type : "None"],
      description: [this.data ? this.data.description : ""],
      unitCost: [this.data ? this.data.unitCost : null, [Validators.required]],
      taxable: [this.data ? this.data.taxable : true]
      // taxIds: [this.data ? this.data.taxIds : null]
    });
  }
  submit(): void {
    this.serverError = "";
    //  this.itemForm.value.taxRate = "";
    // format tax rate to show in item table
    // if (this.itemForm.value.taxIds && this.itemForm.value.taxIds.length > 0) {
    //   this.itemForm.value.taxIds.forEach((item, index) => {
    //     for (let tax of this.taxList) {
    //       if (tax.id === item) {
    //         this.itemForm.value.taxRate += `${tax.name} + ${tax.amount}%`;
    //       }
    //     }
    //     if (index + 1 !== this.itemForm.value.taxIds.length) {
    //       this.itemForm.value.taxRate += ", ";
    //     }
    //   });
    // }
    if (this.data) {
      this.itemForm.value.id = this.data.id;
      this.itemSubscription = this.itemService
        .updateItem(this.itemForm.value)
        .subscribe(
          result => {
            console.log(result);
            this.dialogRef.close(this.itemForm.value);
          },
          err => {
            console.log(err);
            this.serverError =
              err.error.errmsg ||
              err.error.message ||
              "server error: failed to add item";
          }
        );
      // this.dialogRef.close(this.itemForm.value);
    } else {
      this.itemSubscription = this.itemService
        .addItem(this.itemForm.value)
        .subscribe(
          item => this.dialogRef.close(item),
          err => {
            console.log(err);
            this.serverError =
              err.error.errmsg ||
              err.error.message ||
              "server error: failed to add item";
          }
        );
    }
  }
  ngOnDestroy(): void {
    if (this.itemSubscription) this.itemSubscription.unsubscribe();
  }
}
