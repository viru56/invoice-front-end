import { Component, OnInit } from "@angular/core";
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService, CompanyService } from "src/app/shared/services";
import { ToastrService } from "ngx-toastr";
import { Icompany } from "src/app/shared/models";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  fileToUpload: SafeUrl = null;
  file:File;
  businessProfileForm: FormGroup;
  company: Icompany;
  constructor(
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private authService: AuthService,
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.authService
      .getUserDetails()
      .then(user => {
        this.company = user.company;
        this.fileToUpload = user.company.logoUrl? `${environment.base_url}/${user.company.logoUrl}`:null;
        this.copyForm();
      })
      .catch(err => console.log(err));
    this.buildForm();
  }
  buildForm(): void {
    this.businessProfileForm = this.fb.group({
      name: [this.company ? this.company.name : null],
      email: [
        { value: this.company ? this.company.email : null, disabled: true },
        [Validators.email]
      ],
      address: [this.company ? this.company.address : null],
      city: [this.company ? this.company.city : null],
      state: [this.company ? this.company.state : null],
      postalCode: [this.company ? this.company.postalCode : null],
      taxId: [this.company ? this.company.taxId : null],
      sendTo: [this.company ? this.company.sendTo : null, Validators.required]
    });
  }
  copyForm(): void {
    this.businessProfileForm.controls["name"].setValue(this.company.name);
    this.businessProfileForm.controls["email"].setValue(this.company.email);
    this.businessProfileForm.controls["address"].setValue(this.company.address);
    this.businessProfileForm.controls["city"].setValue(this.company.city);
    this.businessProfileForm.controls["state"].setValue(this.company.state);
    this.businessProfileForm.controls["postalCode"].setValue(
      this.company.postalCode
    );
    this.businessProfileForm.controls["taxId"].setValue(this.company.taxId);
    this.businessProfileForm.controls["sendTo"].setValue(this.company.sendTo);
  }
  handleFileInput(files: FileList) {
    if (files.item(0)) {
      const fileSize: number = parseFloat(
        (files.item(0).size / (1000 * 1024)).toFixed(2)
      );
      if (files.item(0).type.indexOf("image") == -1) {
        alert("The file you have seleted is not an image");
      } else if (fileSize > 5) {
        alert(
          "The image you have selected is too large. It must be 1MB or less"
        );
      } else {
        this.file = files.item(0);
        const reader = new FileReader();
        reader.onload = e => {
          this.fileToUpload = this.sanitizer.bypassSecurityTrustResourceUrl(
            reader.result as string
          );
        };
        reader.readAsDataURL(this.file);
      }
    }
  }
  clearLogoPreview(): void {
    this.fileToUpload = null;
  }

  validateEmail(emails: string): boolean {
    const emailArray = emails.split(",");
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailArray.length <= 5) {
      for (let email of emailArray) {
        if (email && !EMAIL_REGEX.test(email)) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }

  submit(): void {
    if (!this.validateEmail(this.businessProfileForm.value.sendTo)) {
      alert("`Send To` up to 5 valid email are allowed with comma seperated");
      return;
    }
    this.companyService
      .updateCompany(this.businessProfileForm.value,this.file)
      .then(() => this.toastr.success("Business details are updated!"))
      .catch(err => {
        const msg =
          err.error.errmsg ||
          err.error.message ||
          "Failed to update business details";
        this.toastr.error(msg, "Server error");
        console.log(err);
      });
  }
}
