import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TaxDialogComponent, DialogConfig } from "../../shared/dialogs";
import { MatTableDataSource } from "@angular/material";
import {Itax} from '../../shared/models';

const TAX_DATA: Itax[] = [
  { id: 1, name: "C GST", amount: 5, inclusive: false },
  { id: 2, name: "G GST", amount: 5, inclusive: false },
  { id: 3, name: "service tax", amount: 8, inclusive: true }
];

@Component({
  selector: "app-tax",
  templateUrl: "./tax.component.html",
  styleUrls: ["./tax.component.scss"]
})
export class TaxComponent implements OnInit {
  displayedColumns: string[] = ["name", "amount", "taxMode", "action"];
  dataSource: MatTableDataSource<Itax>;
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(TAX_DATA);
  }
  addNewTaxRate(): void {
    DialogConfig.data = null;
    const dialogRef = this.dialog.open(TaxDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if(result){
            result.id = TAX_DATA.length + 1;
            TAX_DATA.push(result);
            this.dataSource.data = TAX_DATA;
          }
        },
        err => console.log(err)
      );
  }
  deleteTaxRate(index: number): void {
    TAX_DATA.splice(index,1);
    this.dataSource.data = TAX_DATA;
  }
  editTaxRate(taxData:Itax): void {
    DialogConfig.data = taxData;
    const dialogRef = this.dialog.open(TaxDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if(result){
            for(let item of TAX_DATA){
              if(item.id === result.id){
                item.name = result.name;
                item.inclusive = result.taxMode;
                item.amount = result.amount;
              }
            }
          }
        },
        err => console.log(err)
      );
  }
}
