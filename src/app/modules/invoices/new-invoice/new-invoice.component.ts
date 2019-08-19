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
import {
  Icustomer,
  IlineItem,
  Iinvoice,
  Itax,
  Iuser
} from "../../../shared/models";
import {
  ItemService,
  CustomerService,
  TaxService,
  AuthService,
  InvoiceService
} from "src/app/shared/services";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
@Component({
  selector: "app-new-invoice",
  templateUrl: "./new-invoice.component.html",
  styleUrls: ["./new-invoice.component.scss"]
})
export class NewInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  filterValue: string;
  invoice: Iinvoice;
  invoiceLogo: string;
  seletedCustomer = new FormControl();
  showDiscount: boolean;
  customerData: Icustomer[] = [];
  itemData: IlineItem[] = [];
  taxData: Itax[] = [];
  currentUser: Iuser;
  formError: string;
  filteredCustomerOptions: Observable<Icustomer[]>;
  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private taxService: TaxService,
    private customerService: CustomerService,
    private authService: AuthService,
    private toastr: ToastrService,
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getData();
    this.showDiscount = false;
    this.invoice = {
      number: null,
      name: "INVOICE",
      sender: "",
      receiver: "",
      date: new Date().toDateString(),
      dueDate: new Date().toString(),
      paymentTerms: null,
      lineItems: {
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
      discountType: "flat",
      discountValue: 0,
      amountPaid: 0,
      shipping: 0,
      notes: "",
      terms: "",
      taxItems: []
    };
    this.filteredCustomerOptions = this.seletedCustomer.valueChanges.pipe(
      startWith(""),
      map(value => (typeof value === "string" ? value : value.name)),
      map(name => (name ? this._filter(name) : this.customerData.slice()))
    );
    this.invoiceForm = this.fb.group({
      name: ["INVOICE", [Validators.required]],
      number: [""],
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
      discountValue: [0],
      discountType: ["flat"],
      notes: [""]
    });
  }
  getData() {
    this.authService.getUserDetails().then(
      user => {
        this.currentUser = user;
        this.invoiceLogo = `${environment.base_url}/${
          this.currentUser.company.logoUrl
        }`;
      },
      err => {
        console.log(err);
        this.toastr.error("Can not get user", "Server Error");
      }
    );
    this.itemService.getItemStore().then(
      data => (this.itemData = data),
      err => {
        console.log(err);
        this.toastr.error("Can not get Line Item", "Server Error");
      }
    );
    this.taxService.getTaxStore().then(
      data => (this.taxData = data),
      err => {
        console.log(err);
        this.toastr.error("Can not get Tax Item", "Server Error");
      }
    );
    this.customerService.getcustomerStore().then(
      data => (this.customerData = data),
      err => {
        console.log(err);
        this.toastr.error("Can not get Customers", "Server Error");
      }
    );
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
    this.updateSubtotal();
  }
  displayCustFn(customer?: Icustomer): string | undefined {
    return customer ? customer.fullName : undefined;
  }
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.customerData.filter(
      option => option.fullName.toLowerCase().indexOf(filterValue) === 0
    );
  }
  selectedCustomerValue() {
    this.invoice.customer = this.seletedCustomer.value.id;
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
    let exclusiveTax = 0;
    if (this.invoice.subtotal > 0) {
      for (let tax of this.invoice.taxItems) {
        if (tax.taxMode === "Exclusive") {
          exclusiveTax += tax.amount;
        }
      }
      this.invoice.total =
        this.invoice.taxableAmount +
        (this.invoice.taxableAmount * exclusiveTax) / 100 +
        this.invoice.nonTaxableAmount;
      if (this.invoiceForm.value.discountType === "percentage") {
        this.invoice.total =
          this.invoice.total -
          (this.invoice.total * this.invoiceForm.value.discountValue) / 100;
      } else if (this.invoiceForm.value.discountType === "flat") {
        this.invoice.total =
          this.invoice.total - this.invoiceForm.value.discountValue;
      }
      if (this.invoiceForm.value.shippin) {
        this.invoice.total -= this.invoiceForm.value.shipping;
      }
      this.invoice.balanceDue = Number(
        (this.invoice.total - this.invoiceForm.value.amountPaid).toFixed(2)
      );
    }
  }
  removeDiscount(): void {
    this.showDiscount = false;
    this.invoiceForm.controls["discountValue"].setValue(0);
    this.updateTotal();
  }
  selectedTaxChange(): void {
    let newItem = true;
    for (let tax of this.invoice.taxItems) {
      if (tax.id === this.invoiceForm.value.selectedTax.id) {
        newItem = false;
      }
    }
    if (newItem) {
      this.invoice.taxItems.push(this.invoiceForm.value.selectedTax);
      this.updateTotal();
    }
    this.invoiceForm.controls["selectedTax"].setValue(null);
  }
  removeTaxItem(index: number): void {
    this.invoice.taxItems.splice(index, 1);
    this.updateTotal();
  }
  onSubmit(): void {
    this.formError = "";
    this.invoice.name = this.invoiceForm.value.name;
    this.invoice.number = this.invoiceForm.value.number || 1;
    this.invoice.date = this.invoiceForm.value.date;
    this.invoice.dueDate = this.invoiceForm.value.dueDate;
    this.invoice.lineItems = this.invoiceForm.value.lineItems;
    this.invoice.amountPaid = this.invoiceForm.value.amountPaid;
    this.invoice.discountType = this.invoiceForm.value.discountType;
    (this.invoice.discountValue = this.invoiceForm.value.discountValue),
      (this.invoice.notes = this.invoiceForm.value.notes);
    this.invoiceService
      .addInvoice(this.invoice)
      .then(res => this.router.navigateByUrl("/auth/invoices"))
      .catch(err => {
        console.log(err);
        this.formError =
          err.error.errmsg ||
          err.error.message ||
          "Server error: failed to create invoice";
        this.toastr.error(
          err.error.errmsg || err.error.message || "failed to create invoice",
          "Server error"
        );
        console.log(err);
      });
  }
}
