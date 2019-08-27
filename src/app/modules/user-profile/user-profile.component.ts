import { Component, OnInit } from "@angular/core";
import { Iuser } from "../../shared/models";
import { AuthService } from "../../shared/services";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"]
})
export class UserProfileComponent implements OnInit {
  currentUser: Iuser;
  userProfileForm: FormGroup;
  serverError: string;
  formErrors = {
    password: "",
    confirmPassword: "",
    fullName: ""
  };
  validationMessages = {
    password: {
      required: "please enter your password",
      pattern: "password is not valid"
    },
    confirmPassword: {
      required: "Please confirm your password",
      mustMatch: "password did not match"
    },
    fullName: {
      required: "Full name is required"
    }
  };
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authService.getUserDetails().then(
      user => {
        this.currentUser = user;
        this.copyForm();
      },
      err => console.log(err)
    );
    this.initForm();
  }
  initForm(): void {
    this.userProfileForm = this.fb.group(
      {
        company: [{ value: "", disabled: true }],
        fullName: ["", [Validators.required]],
        email: [{ value: "", disabled: true }],
        password: [
          null,
          [Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,24}$/)]
        ],
        confirmPassword: [null]
      },
      { validator: this.mustMatch("password", "confirmPassword") }
    );
    this.userProfileForm.valueChanges.subscribe(data =>
      this.onValueChanged(data)
    );
    this.onValueChanged();
  }
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  onValueChanged(data?: any) {
    this.serverError = '';
    if (!this.userProfileForm) {
      return;
    }
    const form = this.userProfileForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }
  copyForm(): void {
    this.userProfileForm.controls["fullName"].setValue(
      this.currentUser.fullName
    );
    this.userProfileForm.controls["email"].setValue(this.currentUser.email);
    this.userProfileForm.controls["company"].setValue(
      this.currentUser.company.name
    );
  }
  submit(): void {
    let formChange = false;
    if (
      this.userProfileForm.value.password &&
      !this.userProfileForm.value.confirmPassword.trim()
    ) {
      alert("Confrim password is required");
      return;
    }
    if (
      this.currentUser.fullName !== this.userProfileForm.value.fullName.trim()
    ) {
      formChange = true;
    }
    if (this.userProfileForm.value.password) {
      formChange = true;
    }
    if (formChange) {
      this.userProfileForm.value.id = this.currentUser.id;
      this.authService.userUpdate(this.userProfileForm.value).then(
        res => {
          this.toastr.success("User details are updated");
          setTimeout(() => window.location.reload(), 500);
        },
        err => {
          console.log(err);
          this.serverError =
            err.error.message || "Server error : failed to update user details";
        }
      );
    }
  }
}
