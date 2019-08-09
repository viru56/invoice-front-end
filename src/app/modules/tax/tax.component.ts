import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TaxDialogComponent, DialogConfig } from "../../shared/dialogs";
import { MatTableDataSource } from "@angular/material";
import { MatSort } from "@angular/material/sort";
import { Itax } from "../../shared/models";
import { TaxService } from "src/app/shared/services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-tax",
  templateUrl: "./tax.component.html",
  styleUrls: ["./tax.component.scss"]
})
export class TaxComponent implements OnInit {
  displayedColumns: string[] = ["name", "amount", "taxMode", "action"];
  dataSource: MatTableDataSource<Itax>
  @ViewChild(MatSort) sort: MatSort;
  itemLoading: string;
  constructor(
    private dialog: MatDialog,
    private taxService: TaxService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.itemLoading = "loading...";
    this.dataSource = new MatTableDataSource([]);
    this.getAllTaxItems();
  }
  getAllTaxItems(): void {
    this.taxService
      .getTaxStore()
      .then(items => {
        this.dataSource.data = items;
        setTimeout(() => (this.dataSource.sort = this.sort));
        if (items.length === 0) {
          this.itemLoading = "No Item Found";
        }
      })
      .catch(err => {
        console.log(err);
        this.itemLoading = `Server Error:   ${err.statusText}`;
        this.toastr.error("faild to load items", "Server Error");
      });
  }
  addNewTaxRate(): void {
    DialogConfig.data = null;
    const dialogRef = this.dialog.open(TaxDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            this.getAllTaxItems();
            this.toastr.success('New tax item is added!');
          }
        },
        err => console.log(err)
      );
  }
  deleteTaxRate(index: number, id: string): void {
    this.taxService
      .deleteTaxItem(index, id)
      .then(() => {
        this.getAllTaxItems();
        this.toastr.success("Tax item is deleted!");
      })
      .catch(err => {
        console.log(err);
        this.toastr.error("Failed to delete Tax item!", "Server error");
      });
  }
  editTaxRate(taxData: Itax): void {
    DialogConfig.data = taxData;
    const dialogRef = this.dialog.open(TaxDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            if (result) {
              this.getAllTaxItems();
              this.toastr.success("Tax item is updated!");
            }
          }
        },
        err => console.log(err)
      );
  }
}
