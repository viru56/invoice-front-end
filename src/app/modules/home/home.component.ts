import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Iinvoice, IlineItem } from "../../shared/models";
import { InvoiceService, StorageService } from "src/app/shared/services";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { HomeDialogComponent, DialogConfig } from "src/app/shared/dialogs";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  invoiceForm: FormGroup;
  invoice: Iinvoice;
  fileToUpload: SafeUrl = null;
  showDiscount: boolean;
  showTax: boolean;
  showShipping: boolean;
  l_invoicesIds: Array<number>;
  invoiceExists: boolean;
  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.invoiceExists = false;
    this.l_invoicesIds = this.storageService.getItem("l_invoicesIds");
    if (!this.l_invoicesIds) this.l_invoicesIds = [];
    this.route.paramMap.subscribe(params => {
      if (params.has("id")) {
        const id = Number(params.get("id"));
        if (
          this.l_invoicesIds &&
          this.l_invoicesIds.length > 0 &&
          this.l_invoicesIds.indexOf(id) !== -1
        ) {
          this.invoiceExists = true;
          this.invoice = this.storageService.getItem(`l_invoice-${id}`);
          if (this.invoice.shipping) this.showShipping = true;
          if (this.invoice.discountValue) this.showDiscount = true;
          if (this.invoice.taxItems[0].amount) this.showTax = true;
          const file = this.storageService.getItem("file");
          this.fileToUpload = file
            ? this.sanitizer.bypassSecurityTrustResourceUrl(file)
            : null;
          if (file) {
            this.invoice.file = this.b64toFile(
              file.split(",")[1],
              file
                .split(",")[0]
                .split(";")[0]
                .split(":")[1]
            );
          }
        } else {
          this.invoiceExists = false;
        }
      }
    });
    if (!this.invoiceExists) {
      this.showDiscount = false;
      this.showTax = false;
      this.showShipping = false;
      this.invoice = {
        label: {
          name: "INVOICE",
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
        name: "INVOICE",
        number: this.l_invoicesIds.length + 1,
        sender: "",
        receiver: "",
        lineItems: [
          {
            name: "",
            unitCost: 0,
            quantity: 0,
            amount: 0,
            taxable: true
          }
        ],
        taxItems: [
          {
            name: "",
            amount: 0,
            taxMode: "Exclusive"
          }
        ],
        subtotal: 0,
        total: 0,
        balanceDue: 0,
        amountPaid: 0,
        discountType: "flat",
        discountValue: 0,
        shipping: 0,
        paymentTerms: "",
        date: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        notes: "",
        terms: ""
      };
    }
    this.buildForm();
  }
  buildForm() {
    this.invoiceForm = this.fb.group({
      number: [this.invoice.number],
      sender: [this.invoice.sender, Validators.required],
      receiver: [this.invoice.receiver, Validators.required],
      date: [this.invoice.date],
      paymentTerms: [this.invoice.paymentTerms],
      dueDate: [this.invoice.dueDate],
      lineItems: this.fb.array([
        this.fb.group({
          name: [this.invoice.lineItems[0].name],
          quantity: [this.invoice.lineItems[0].quantity],
          unitCost: [this.invoice.lineItems[0].unitCost],
          amount: [this.invoice.lineItems[0].amount]
        })
      ]),
      discountValue: [this.invoice.discountValue],
      discountType: [this.invoice.discountType],
      tax: [this.invoice.taxItems[0].amount],
      shipping: [this.invoice.shipping],
      notes: [this.invoice.notes],
      terms: [this.invoice.terms],
      amountPaid: [this.invoice.amountPaid]
    });
    if (this.invoice.lineItems.length > 1) {
      for (var i = 1; i < this.invoice.lineItems.length; i++) {
        this.addLineItem(this.invoice.lineItems[i]);
      }
    }
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
      } else if (fileSize > 10) {
        alert(
          "The image you have selected is too large. It must be 1MB or less"
        );
      } else {
        this.invoice.file = files.item(0);
        const reader = new FileReader();
        reader.onload = e => {
          this.fileToUpload = this.sanitizer.bypassSecurityTrustResourceUrl(
            reader.result as string
          );
          this.storageService.setItem("file", reader.result);
        };
        reader.readAsDataURL(this.invoice.file);
      }
    }
  }
  clearLogoPreview(): void {
    this.fileToUpload = null;
    this.storageService.removeItem('file');
  }
  addLineItem(lineItem?: IlineItem): void {
    this.lineItems.push(
      this.fb.group({
        name: [lineItem ? lineItem.name : ""],
        quantity: [lineItem ? lineItem.quantity : 0],
        unitCost: [lineItem ? lineItem.unitCost : 0],
        amount: [lineItem ? lineItem.amount : 0]
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
  removeTaxDiscountShipping(property: string): void {
    if (property === "discount") {
      this.showDiscount = false;
      this.invoiceForm.controls["discountValue"].setValue(0);
    } else if (property === "tax") {
      this.showTax = false;
      this.invoiceForm.controls["tax"].setValue(0);
    } else if (property === "shipping") {
      this.showShipping = false;
      this.invoiceForm.controls["shipping"].setValue(0);
    }

    this.updateTotal();
  }
  updateLineItemAmount(index: number): void {
    this.lineItems.controls[index]
      .get("amount")
      .setValue(
        Math.round(
          this.lineItems.controls[index].get("unitCost").value *
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
    if (this.invoiceForm.value.discountType === "percentage") {
      this.invoice.total -=
        (this.invoice.total * this.invoiceForm.value.discountValue) / 100;
    } else if (this.invoiceForm.value.discountType === "flat") {
      this.invoice.total -= this.invoiceForm.value.discountValue;
    }
    this.invoice.total +=
      (this.invoice.total * this.invoiceForm.value.tax) / 100;
    this.invoice.total += this.invoiceForm.value.shipping;
    this.invoice.balanceDue =
      this.invoice.total - this.invoiceForm.value.amountPaid;
  }

  onSubmit() {
    if (this.setInvoiceData()) {
      DialogConfig.data = {
        sender: this.invoice.sender,
        receiver: this.invoice.receiver,
        number: this.invoice.number,
        mail: this.invoice.mail
      };
      const dialogRef = this.dialog.open(HomeDialogComponent, DialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.invoice.mail = result;
          this.invoice.mail.userName = this.invoice.receiver;
          this.storageService.setItem(
            `l_invoice-${this.invoice.number}`,
            this.invoice
          );
          this.createInvoice();
        }
      });
    }
  }
  setInvoiceData(): boolean {
    if (!this.invoiceForm.value.sender && !this.invoiceForm.value.receiver) {
      alert("required field is empty");
      return false;
    }
    this.invoice.sender = this.invoiceForm.value.sender;
    this.invoice.receiver = this.invoiceForm.value.receiver;
    this.invoice.date = this.invoiceForm.value.date;
    this.invoice.dueDate = this.invoiceForm.value.dueDate;
    // this.invoice.paymentTerms = this.invoiceForm.value.paymentTerms;
    this.invoice.number = this.invoiceForm.value.number;
    this.invoice.lineItems = this.invoiceForm.value.lineItems;
    this.invoice.discountType = this.invoiceForm.value.discountType;
    this.invoice.discountValue = this.invoiceForm.value.discountValue;
    this.invoice.taxItems = [
      {
        amount: this.invoiceForm.value.tax,
        taxMode: "Exclusive",
        name: ""
      }
    ];
    this.invoice.shipping = this.invoiceForm.value.shipping;
    this.invoice.amountPaid = this.invoiceForm.value.amountPaid;
    this.invoice.notes = this.invoiceForm.value.notes;
    this.invoice.terms = this.invoiceForm.value.terms;
    this.invoice.createdAt = new Date();
    // store invoice in local storage
    this.storageService.setItem(
      `l_invoice-${this.invoice.number}`,
      this.invoice
    );
    if (this.l_invoicesIds.indexOf(this.invoice.number) === -1) {
      this.l_invoicesIds.push(this.invoice.number);
      this.storageService.setItem("l_invoicesIds", this.l_invoicesIds);
    }
    return true;
  }
  createInvoice(type: string = "mail"): void {
    this.invoiceService.createInvoice(this.invoice, type).subscribe(
      res => {
        if (type === "mail") {
          this.toastr.success(res.message);
        } else {
          this.invoiceService.downLoadFile(res);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  downloadInvoice(): void {
    if (this.setInvoiceData()) this.createInvoice("download");
  }
  b64toFile(b64Data, contentType): File {
    contentType = contentType || "";
    const sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return <File>blob;
  }
}
