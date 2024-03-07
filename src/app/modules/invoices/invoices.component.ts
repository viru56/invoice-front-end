import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import {
  InvoiceService,
  CustomerService,
  AuthService
} from "../../shared/services";
import { Iinvoice, Icustomer } from "src/app/shared/models";
import { ToastrService } from "ngx-toastr";
import {
  InvoiceDialogComponent,
  DialogConfig,
  PaymentDialogComponent
} from "src/app/shared/dialogs";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-invoices",
  templateUrl: "./invoices.component.html",
  styleUrls: ["./invoices.component.scss"]
})
export class InvoicesComponent implements OnInit {
  dataSource: MatTableDataSource<Iinvoice>;
  @ViewChild(MatSort) sort: MatSort;
  itemLoading: string;
  customers: Icustomer[];
  displayedColumns: string[] = [
    "number",
    "customerName",
    "dueDate",
    "total",
    "balanceDue",
    "action"
  ];
  statusData: string[] = ["Draft", "Sent", "Paid", "Outstanding", "All"];
  status: string;
  invoices: Iinvoice[];
  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.itemLoading = "loading...";
    this.dataSource = new MatTableDataSource([]);
    this.getAllInvoices();
  }
  getAllInvoices(): void {
    this.invoiceService
      .getInvoiceStore()
      .then(items => {
        this.invoices = items;
        this.customerService.getcustomerStore().then(
          customers => {
            this.customers = customers;
            for (let item of items) {
              for (let customer of customers) {
                if (item.customer === customer.id) {
                  item.customerName = customer.fullName;
                }
              }
            }
            this.dataSource.data = items;
          },
          err => console.log(err)
        );
        setTimeout(() => (this.dataSource.sort = this.sort));
        if (items.length === 0) {
          this.itemLoading = "No Invoice Found";
        }
      })
      .catch(err => {
        console.log(err);
        this.itemLoading = `Server Error:   ${err.statusText}`;
        this.toastr.error("faild to load invoices", "Server Error");
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteInvoice(id: string, index: number): void {
    this.invoiceService
      .deleteInvoice(id, index)
      .then(() => {
        this.getAllInvoices();
        this.toastr.success("Invoice is deleted!");
      })
      .catch(err => {
        console.log(err);
        this.toastr.error("Failed to delete Invoice!", "Server error");
      });
  }
  changeStatus(): void {
    const filteredData = [];
    this.dataSource.data = this.invoices;
    if (this.status.toLowerCase() === "outstanding") {
      for (let item of this.invoices) {
        if (new Date(item.dueDate) < new Date()) {
          filteredData.push(item);
        }
      }
      this.dataSource.data = filteredData;
    } else {
      this.dataSource.filter =
        this.status.toLowerCase() !== "all" ? this.status.toLowerCase() : "";
    }
  }
  downloadInvoice(id: string, filename: string) {
    this.toastr.info("invoice is downloading!");
    this.invoiceService
      .downloadInvoice(id, filename)
      .then(() => {
        this.toastr.clear();
      })
      .catch(err => {
        console.log(err);
        this.toastr.error("Failed to download invoice", "Server error");
      });
  }
  sendInvoice(invoice: Iinvoice) {
    try {
      this.customerService
        .getCustomerDetails(invoice.customer)
        .then(customer => {
          this.authService.getUserDetails().then(user => {
            DialogConfig.data = {
              id: invoice.id,
              to: customer.email,
              companyName: user.company.name,
              number: invoice.number,
              balanceDue: invoice.balanceDue,
              userName: customer.attentionTo || customer.fullName
            };
            const dialogRef = this.dialog.open(
              InvoiceDialogComponent,
              DialogConfig
            );
            dialogRef
              .afterClosed()
              .toPromise()
              .then(
                result => {
                  if (result) {
                    console.log(result);
                    this.toastr.success("Invoice is sent!");
                    this.getAllInvoices();
                  }
                },
                err => console.log(err)
              );
          });
        });
    } catch (error) {
      console.log(error);
    }
  }
  receivePayment(invoice: Iinvoice): void {
    DialogConfig.data = invoice;
    const dialogRef = this.dialog.open(PaymentDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            this.toastr.success("Your payment has been recorded!");
            this.getAllInvoices();
          }
        },
        err => console.log(err)
      );
  }
}
