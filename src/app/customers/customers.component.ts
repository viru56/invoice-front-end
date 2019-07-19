import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CustomerDialogComponent, DialogConfig } from "../dialogs";
import { Icustomer } from "../models";

const CUST_DATA: Icustomer[] = [
  {
    id: 1,
    name: "Virender",
    collections: 0,
    email: "nehra.virender@gmail.com",
    taxId: "135343",
    account: "#00001",
    notes: "this is private notes for the customer",
    address: {
      attentionTo: "virender",
      address_1: "hoorian arcade",
      address_2: "viganana nagar",
      city: "bangalore",
      state: "karnataka",
      country: "india",
      phone: 8123465672,
      postalCode: 560075
    }
  },
  {
    id: 2,
    name: "ayush",
    collections: 0,
    email: "ayush.yadav@gmail.com",
    taxId: "345345",
    account: "#00002",
    notes: "this is private notes for the customer",
    address: {
      attentionTo: "ayush",
      address_1: "hoorian arcade",
      address_2: "viganana nagar",
      city: "bangalore",
      state: "karnataka",
      country: "india",
      phone: 8123465672,
      postalCode: 560075
    }
  },
  {
    id: 3,
    name: "manoj",
    collections: 0,
    email: "manoj.ojha@gmail.com",
    taxId: "13213",
    account: "#00003",
    notes: "this is private notes for the customer",
    address: {
      attentionTo: "manoj",
      address_1: "hoorian arcade",
      address_2: "viganana nagar",
      city: "bangalore",
      state: "karnataka",
      country: "india",
      phone: 8123465672,
      postalCode: 560075
    }
  }
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
  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(CUST_DATA);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  addNewCustomer() {
    DialogConfig.data = null;
    const dialogRef = this.dialog.open(CustomerDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            result.id = CUST_DATA.length + 1;
            result.collections = 0;
            CUST_DATA.push(result);
            this.dataSource.data = CUST_DATA;
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
            for (let item of CUST_DATA) {
              if (item.id === result.id) {
                item.name = result.name;
                item.notes = result.notes;
                item.taxId = result.taxId;
                item.email = result.email;
                item.account = result.account;
                item.address.address_1 = result.address.address_1;
                item.address.address_2 = result.address.address_2;
                item.address.attentionTo = result.address.attentionTo;
                item.address.city = result.address.city;
                item.address.country = result.address.country;
                item.address.phone = result.address.phone;
                item.address.postalCode = result.address.postalCode;
                item.address.state = result.address.state;
              }
            }
          }
        },
        err => console.log(err)
      );
  }
}
