import { Component, OnInit } from "@angular/core";
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  fileToUpload: SafeUrl = null;
  businessProfileForm: FormGroup;
  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder) {}

  ngOnInit() {
    this.businessProfileForm = this.fb.group({
      businessName: [null],
      email: [null, [Validators.email]],
      address: [null ],
      city: [null],
      state: [null],
      zipCode: [null],
      taxId: [null],
      sendTo: [null, Validators.required]
    });
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

  submit(): void {
    console.log(this.businessProfileForm.value.sendTo);
    if(this.validateEmail(this.businessProfileForm.value.sendTo)){

    }else {
      alert('`Send To` up to 5 valid email are allowed with comma seperated')
    }

  }
  validateEmail(emails:string):boolean{
    const emailArray = emails.split(',');
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(emailArray.length <5){
      for(let email of emailArray){
        if(email && !EMAIL_REGEX.test(email)){
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
}
