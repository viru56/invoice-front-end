import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Invoice } from "../models";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  invoiceForm: FormGroup;
  invoice: Invoice;
  fileToUpload: SafeUrl = null;
  showDiscount: boolean;
  showTax: boolean;
  showShipping: boolean;
  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder) {}

  ngOnInit() {
    this.showDiscount = false;
    this.showTax = false;
    this.showShipping = false;
    this.invoice = {
      label: {
        invoiceName: "INVOICE",
        date: "Date",
        paymentTerms: "Payment terms",
        dueDate: "Due date",
        lineItemName: "Item",
        lineItemQuantity: "Quantity",
        lineItemRate: "Rate",
        lineItemAmount: "Amount",
        subtotal: "Subtotal",
        discount: "Discount",
        tax: "Tax",
        shipping: "Shipping",
        total: "Total",
        amountPaid: "Amount paid",
        balanceDue: "balance due",
        notes: "Notes",
        terms: "Terms"
      },
      invoiceNumber: Date.now(),
      tax_type: "flat",
      discount_type: "flat",
      sender: "",
      receiver: "",
      lineItem: {
        name: "",
        rate: 0,
        quantity: 0,
        amount: 0.0
      },
      subtotal: 0.0,
      total: 0.0,
      balanceDue: 0.0,
      amountPaid: 0.0,
      discount: 0,
      tax: 0,
      shipping: 0,
      paymentTerms: "",
      date: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      notes: "",
      terms: ""
    };
    this.invoiceForm = this.fb.group({
      invoiceNumber: [this.invoice.invoiceNumber],
      sender: [this.invoice.sender, Validators.required],
      receiver: [this.invoice.receiver, Validators.required],
      date: [this.invoice.date],
      paymentTerms: [this.invoice.paymentTerms],
      dueDate: [this.invoice.dueDate],
      lineItems: this.fb.array([
        this.fb.group({
          name: [this.invoice.lineItem.name],
          quantity: [this.invoice.lineItem.quantity],
          rate: [this.invoice.lineItem.rate],
          amount: [this.invoice.lineItem.amount]
        })
      ]),
      discount: [this.invoice.discount],
      tax: [this.invoice.tax],
      shipping: [this.invoice.shipping],
      notes: [this.invoice.notes],
      terms: [this.invoice.terms],
      tax_type: [this.invoice.tax_type],
      discount_type: [this.invoice.discount_type],
      amountPaid: [this.invoice.amountPaid]
    });
  }
  get lineItems() {
    return this.invoiceForm.get("lineItems") as FormArray;
  }
  handleFileInput(files: FileList) {
    if (files.item(0)) {
      const fileSize: number = parseFloat(
        (files.item(0).size / (1000 * 1024)).toFixed(2)
      );
      if (files.item(0).type.indexOf("image") == -1) {
        alert("The file you have seleted is not an image");
      } else if (fileSize > 2) {
        alert(
          "The image you have selected is too large. It must be 1MB or less"
        );
      } else {
        const file = files.item(0);
        const reader = new FileReader();
        reader.onload = e => {
          this.fileToUpload = this.sanitizer.bypassSecurityTrustResourceUrl(
            reader.result as string
            );
        };
        reader.readAsDataURL(file);
      }
    }
  }
  clearLogoPreview(): void {
    this.fileToUpload = null;
  }
  addLineItem(): void {
    this.lineItems.push(
      this.fb.group({
        name: [this.invoice.lineItem.name],
        quantity: [this.invoice.lineItem.quantity],
        rate: [this.invoice.lineItem.rate],
        amount: [this.invoice.lineItem.amount]
      })
    );
  }
  removeLineItem(index: number): void {
    this.lineItems.removeAt(index);
    this.updateSubtotal();
  }
  showShippingInp(): void {
    this.showShipping
      ? (this.showShipping = false)
      : (this.showShipping = true);
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
    for (let item of this.lineItems.controls) {
      this.invoice.subtotal += item.value.amount;
    }
    this.updateTotal();
  }
  updateTotal(): void {
    this.invoice.total = this.invoice.subtotal;
    if (this.invoiceForm.value.discount_type === "percentage") {
      this.invoice.total =
        this.invoice.total -
        (this.invoice.total * this.invoiceForm.value.discount) / 100;
    } else if (this.invoiceForm.value.discount_type === "flat") {
      this.invoice.total = this.invoice.total - this.invoiceForm.value.discount;
    }
    if (this.invoiceForm.value.tax_type === "percentage") {
      this.invoice.total =
        this.invoice.total -
        (this.invoice.total * this.invoiceForm.value.tax) / 100;
    } else if (this.invoiceForm.value.tax_type === "flat") {
      this.invoice.total = this.invoice.total - this.invoiceForm.value.tax;
    }
    this.invoice.total = this.invoice.total - this.invoiceForm.value.shipping;
    this.invoice.balanceDue =
      this.invoice.total - this.invoiceForm.value.amountPaid;
  }

  onSubmit() {
    this.invoice.sender = this.invoiceForm.value.sender;
    this.invoice.receiver = this.invoiceForm.value.receiver;
    this.invoice.date = this.invoiceForm.value.date;
    this.invoice.dueDate = this.invoiceForm.value.dueDate;
    this.invoice.paymentTerms = this.invoiceForm.value.paymentTerms;
    this.invoice.invoiceNumber = this.invoiceForm.value.invoiceNumber;
    this.invoice.lineItem = this.invoiceForm.value.lineItems;
    this.invoice.discount = this.invoiceForm.value.discount;
    this.invoice.discount_type = this.invoiceForm.value.discount_type;
    this.invoice.tax = this.invoiceForm.value.tax;
    this.invoice.tax_type = this.invoiceForm.value.tax_type;
    this.invoice.shipping = this.invoiceForm.value.shipping;
    this.invoice.amountPaid = this.invoiceForm.value.amountPaid;
    this.invoice.notes = this.invoiceForm.value.notes;
    this.invoice.terms = this.invoiceForm.value.terms;
    console.log(this.invoice);
  }
}
