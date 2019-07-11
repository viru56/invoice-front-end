import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

export interface Icustomer {
  id: number;
  name: string;
  collections: number;
}

const CUST_DATA: Icustomer[] = [
  { id: 1, name: "Virender", collections: 0 },
  { id: 2, name: "jay", collections: 0 }
];

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"]
})
export class CustomersComponent implements OnInit {
  dataSource: MatTableDataSource<Icustomer>;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ["name", "collections", "action"];
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
  addNewCustomer() {
    alert("add new user");
  }
}
