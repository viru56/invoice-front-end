import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
export interface Icustomer {
  id: number;
  invoiceNumber: string;
  customer: string;
  status: string;
  date: string;
  total: number;
  balance: number;
}

const CUST_DATA: Icustomer[] = [
  {
    id: 1,
    invoiceNumber: "Virender",
    customer: "nehra",
    status: "paid",
    date: "Jul,5 2019",
    total: 1000,
    balance: 100
  },
  {
    id: 2,
    invoiceNumber: "Virender",
    customer: "viru",
    status: "sent",
    date: "Jul,5 2019",
    total: 2000,
    balance: 1000
  },
  {
    id: 3,
    invoiceNumber: "Virender",
    customer: "jay",
    status: "draft",
    date: "Jul,5 2019",
    total: 4000,
    balance: 2500
  },
  {
    id: 4,
    invoiceNumber: "Virender",
    customer: "viru",
    status: "outstanding",
    date: "Jul,5 2019",
    total: 1000,
    balance: 0
  },
  {
    id: 5,
    invoiceNumber: "Virender",
    customer: "ajay",
    status: "paid",
    date: "Jul,5 2019",
    total: 1000,
    balance: 500
  },
  {
    id: 6,
    invoiceNumber: "Virender",
    customer: "jay",
    status: "sent",
    date: "Jul,5 2019",
    total: 5000,
    balance: 0
  }
];

@Component({
  selector: "app-invoices",
  templateUrl: "./invoices.component.html",
  styleUrls: ["./invoices.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class InvoicesComponent implements OnInit {
  dataSource: MatTableDataSource<Icustomer>;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "invoiceNumber",
    "customer",
    "date",
    "total",
    "balance",
    "action"
  ];
  statusData: string[] = ["Draft", "Sent", "Paid", "Outstanding", "All"];
  status:string;
  constructor() {
    this.dataSource = new MatTableDataSource(CUST_DATA);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteTaxRate(id: number): void {
    console.log(id);
  }
  editTaxRate(id: number): void {
    console.log(id);
  }
  newInvoice() {
    alert("new invoice");
  }
  
  changeStatus():void{
    this.dataSource.filter = this.status.toLowerCase() !=='all' ? this.status.toLowerCase() : ''
  }
}
