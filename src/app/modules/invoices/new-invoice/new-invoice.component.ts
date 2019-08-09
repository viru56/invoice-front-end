import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Icustomer, IlineItem, Iinvoice, Itax } from "../../../shared/models";
@Component({
  selector: "app-new-invoice",
  templateUrl: "./new-invoice.component.html",
  styleUrls: ["./new-invoice.component.scss"]
})
export class NewInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  filterValue: string;
  invoice: Iinvoice;
  invoiceLogo = "assets/branding-sample.png";
  seletedCustomer = new FormControl();
  showDiscount: boolean;
  CUST_DATA: Icustomer[] = [
    {
      id: 1,
      name: "Virender nehra",
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
  ITEM_DATA: IlineItem[] = [
    {
      id: '1',
      name: "abc",
      description: "this is a test item",
      type: "service",
      unitCost: 100,
      taxable: true
    },
    {
      id: '2',
      name: "work",
      description: "thai adf kladjf kladjf kladfj akldfa klsdfakls ",
      type: "product",
      unitCost: 100,
      taxable: true
    },
    {
      id: '3',
      name: "iphone",
      description: "If you do not have an iphone,you do not have an iphone",
      type: "product",
      unitCost: 100000,
      taxable: true
    },
    {
      id: '4',
      name: "qwerty",
      description: "this is a blackberry phone",
      type: "product",
      unitCost: 10000,
      taxable: false
    }
  ];
  TAX_DATA: Itax[] = [
    { id: '1', name: "C GST", amount: 5, inclusive: false },
    { id: '2', name: "G GST", amount: 5, inclusive: false },
    { id: '3', name: "service tax", amount: 8, inclusive: true }
  ];
  filteredCustomerOptions: Observable<Icustomer[]>;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.showDiscount = false;
    this.invoice = {
      invoiceNumber: null,
      invoiceName: "INVOICE",
      sender: "",
      receiver: "",
      date: new Date().toDateString(),
      dueDate: new Date().toString(),
      paymentTerms: null,
      lineItem: {
        name: "",
        quantity: 0,
        unitCost: 0,
        taxable: true,
        amount: 0
      },
      subtotal: 0,
      taxableAmount: 0,
      nonTaxableAmount: 0,
      total: 0,
      balanceDue: 0,
      discount: {
        type: "flat",
        value: 0
      },
      amountPaid: 0,
      shipping: 0,
      notes: "",
      terms: "",
      tax: []
    };
    this.filteredCustomerOptions = this.seletedCustomer.valueChanges.pipe(
      startWith(""),
      map(value => (typeof value === "string" ? value : value.name)),
      map(name => (name ? this._filter(name) : this.CUST_DATA.slice()))
    );
    this.invoiceForm = this.fb.group({
      invoiceName: ["INVOICE", [Validators.required]],
      invoiceNumber: [""],
      date: [new Date(), [Validators.required]],
      dueDate: [
        new Date(new Date().setDate(new Date().getDate() + 7)),
        [Validators.required]
      ],
      selectedItem: [null],
      selectedTax: [null],
      amountPaid: [0],
      lineItems: this.fb.array([
        this.fb.group({
          name: ["", [Validators.required]],
          quantity: [0, [Validators.required]],
          rate: [0, [Validators.required]],
          taxable: [true],
          amount: [0]
        })
      ]),
      discount: [0],
      discount_type: ["flat"],
      notes: [""]
    });
  }
  get lineItems() {
    return this.invoiceForm.get("lineItems") as FormArray;
  }
  addLineItem(item?: IlineItem): void {
    this.lineItems.push(
      this.fb.group({
        name: [item ? item.name : ""],
        quantity: [item ? 1 : 0],
        rate: [item ? item.unitCost : 0],
        amount: [item ? item.unitCost : 0],
        taxable: [item ? item.taxable : true]
      })
    );
  }
  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
    // this.updateSubtotal();
  }
  displayCustFn(customer?: Icustomer): string | undefined {
    return customer ? customer.name : undefined;
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.CUST_DATA.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }
  selectedCustomerValue() {
    console.log(this.seletedCustomer.value);
  }
  selectedLineItem() {
    this.addLineItem(this.invoiceForm.value.selectedItem);
    this.invoiceForm.controls["selectedItem"].setValue(null);
    this.updateSubtotal();
  }
  updateLineItemAmount(index: number): void {
    this.lineItems.controls[index]
      .get("amount")
      .setValue(
        Math.round(
          this.lineItems.controls[index].get("rate").value *
            this.lineItems.controls[index].get("quantity").value
        )
      );
    this.updateSubtotal();
  }
  updateSubtotal(): void {
    this.invoice.subtotal = 0;
    this.invoice.taxableAmount = 0;
    this.invoice.nonTaxableAmount = 0;
    for (let item of this.lineItems.controls) {
      if (item.value.taxable) {
        this.invoice.taxableAmount += item.value.amount;
      } else {
        this.invoice.nonTaxableAmount += item.value.amount;
      }
    }
    this.invoice.subtotal =
      this.invoice.taxableAmount + this.invoice.nonTaxableAmount;
    this.updateTotal();
  }
  updateTotal(): void {
    if (this.invoice.subtotal > 0) {
      this.invoice.total = this.invoice.nonTaxableAmount;
      this.invoice.total = this.invoice.total + this.invoice.taxableAmount;
      if (this.invoice.tax.length > 0) {
        for (let tax of this.invoice.tax) {
          this.invoice.total =
            this.invoice.total - (this.invoice.total * tax.amount) / 100;
        }
      }
      if (this.invoiceForm.value.discount_type === "percentage") {
        this.invoice.total =
          this.invoice.total -
          (this.invoice.total * this.invoiceForm.value.discount) / 100;
      } else if (this.invoiceForm.value.discount_type === "flat") {
        this.invoice.total =
          this.invoice.total - this.invoiceForm.value.discount;
      }
      if (this.invoiceForm.value.shippin) {
        this.invoice.total -= this.invoiceForm.value.shipping;
      }
      this.invoice.balanceDue =
        this.invoice.total - this.invoiceForm.value.amountPaid;
    }
  }
  removeDiscount(): void {
    this.showDiscount = false;
    this.invoiceForm.controls["discount"].setValue(0);
    this.updateTotal();
  }
  selectedTaxChange(): void {
    let newItem = true;
    for (let tax of this.invoice.tax) {
      if (tax.id === this.invoiceForm.value.selectedTax.id) {
        newItem = false;
      }
    }
    if (newItem) {
      this.invoice.tax.push(this.invoiceForm.value.selectedTax);
      this.updateTotal();
    }
    this.invoiceForm.controls["selectedTax"].setValue(null);
  }
  removeTaxItem(index: number): void {
    this.invoice.tax.splice(index, 1);
  }
  onSubmit(): void {
    this.invoice.invoiceName = this.invoiceForm.value.invoiceName;
    this.invoice.invoiceNumber = this.invoiceForm.value.invoiceNumber;
    this.invoice.date = this.invoiceForm.value.date;
    this.invoice.dueDate = this.invoiceForm.value.dueDate;
    this.invoice.lineItem = this.invoiceForm.value.lineItem;
    this.invoice.amountPaid = this.invoiceForm.value.amountPaid;
    this.invoice.discount = {
      value: this.invoiceForm.value.discount,
      type: this.invoiceForm.value.discount_type
    };
    this.invoice.notes = this.invoiceForm.value.notes;
  }
}
