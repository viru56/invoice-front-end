import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CustomerDialogComponent, DialogConfig } from "../../shared/dialogs";
import { Icustomer } from "../../shared/models";
import { CustomerService } from "../../shared/services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"]
})
export class CustomersComponent implements OnInit {
  dataSource: MatTableDataSource<Icustomer>;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["fullName", "collections", "action"];
  itemLoading: string;
  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.itemLoading = "loading...";
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.filterPredicate = (data,value)=>data.fullName.indexOf(value) != -1; // apply filter on full name only
    this.getAllCustomers();
  }
  applyFilter(input: string) {
   this.dataSource.filter = input.trim().toLowerCase();
  }
  getAllCustomers(): void {
    this.customerService
      .getcustomerStore()
      .then(customers => {
        this.dataSource.data = customers;
        setTimeout(() => (this.dataSource.sort = this.sort));
        if (customers.length === 0) {
          this.itemLoading = "No customer Found";
        }
      })
      .catch(err => {
        console.log(err);
        this.itemLoading = `Server Error:   ${err.statusText}`;
        this.toastr.error("faild to load customers", "Server Error");
      });
  }
  addNewCustomer() {
    DialogConfig.data = { accountId: this.dataSource.data.length + 1 };
    const dialogRef = this.dialog.open(CustomerDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            this.getAllCustomers();
            this.toastr.success("New customer is added!");
          }
        },
        err => console.log(err)
      );
  }
  generateReoprt(id: number): void {
    console.log(id);
  }
  editCustomer(customer: Icustomer): void {
    DialogConfig.data = customer;
    const dialogRef = this.dialog.open(CustomerDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            this.getAllCustomers();
            this.toastr.success("Customer details are updated!");
          }
        },
        err => console.log(err)
      );
  }
}
