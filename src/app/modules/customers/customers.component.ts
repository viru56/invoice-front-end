import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CustomerDialogComponent, DialogConfig } from "../../shared/dialogs";
import { Icustomer, Iinvoice } from "../../shared/models";
import { CustomerService, InvoiceService } from "../../shared/services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"]
})
export class CustomersComponent implements OnInit {
  dataSource: MatTableDataSource<Icustomer>;
  @ViewChild(MatSort) sort: MatSort;
  invoices: Iinvoice[];
  customers: Icustomer[];
  displayedColumns: string[] = ["fullName", "collections", "action"];
  itemLoading: string;
  startDate: Date;
  endDate: Date;
  maxDate:Date;
  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.itemLoading = "loading...";
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.filterPredicate = (data, value) =>
      data.fullName.indexOf(value) != -1; // apply filter on full name only
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
        this.customers = customers;
        setTimeout(() => (this.dataSource.sort = this.sort));
        if (customers.length === 0) {
          this.itemLoading = "No customer Found";
        } else {
          this.invoiceService
            .getInvoiceStore()
            .then(invoices => {
              this.invoices = invoices;
              this.filterCustomers();
            })
            .catch(console.log);
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
  dateChange(type: string, event: Date): void {
    if (type === "start") {
      this.startDate = event;
      if (this.endDate) this.filterCustomers();
    }
    if (type === "end") {
      this.endDate = event;
      if (this.startDate) this.filterCustomers();
    }
  }
  filterCustomers(): void {
    for (let cust of this.customers) {
      cust.collections = 0;
      for (let inv of this.invoices) {
        if (inv.customer === cust.id) {
          if (this.startDate && this.endDate) {
            if (
              new Date(inv.updatedAt) >= this.startDate &&
              new Date(inv.updatedAt) < this.endDate
            ) {
              cust.collections += inv.total - inv.balanceDue;
            }
          } else {
            cust.collections += inv.total - inv.balanceDue;
          }
        }
      }
    }
  }
}
