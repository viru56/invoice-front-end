import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { InvoiceService, CustomerService } from "../../shared/services";
import { Iinvoice } from "src/app/shared/models";
import { ToastrService } from "ngx-toastr";
export interface Icustomer {
  id: number;
  number: string;
  customer: string;
  status: string;
  date: string;
  total: number;
  balance: number;
}

@Component({
  selector: "app-invoices",
  templateUrl: "./invoices.component.html",
  styleUrls: ["./invoices.component.scss"]
})
export class InvoicesComponent implements OnInit {
  dataSource: MatTableDataSource<Iinvoice>;
  @ViewChild(MatSort) sort: MatSort;
  itemLoading: string;
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
  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private customerService: CustomerService
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
        this.customerService.getcustomerStore().then(customers=>{
          for(let customer of customers){
            if(customer){
              for(let item of items){
                if(item.customer === customer.id){
                  item.customerName = customer.fullName;
                }
              }
            }
          }
          this.dataSource.data = items;
        },err=>console.log(err));
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
  deleteTaxRate(id: string,index:number): void {
    this.invoiceService
    .deleteInvoice(id,index)
    .then(() => {
      this.getAllInvoices();
      this.toastr.success("Invoice is deleted!");
    })
    .catch(err => {
      console.log(err);
      this.toastr.error("Failed to delete Invoice!", "Server error");
    });
  }
  editTaxRate(id: number): void {
    console.log(id);
  }
  newInvoice() {
    alert("new invoice");
  }

  changeStatus(): void {
    this.dataSource.filter =
      this.status.toLowerCase() !== "all" ? this.status.toLowerCase() : "";
  }
}
