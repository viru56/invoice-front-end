import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/services";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  formErrors = {
    password: "",
    confirmPassword: ""
  };
  validationMessages = {
    password: {
      required: "please enter your password",
      pattern: "password is not valid"
    },
    confirmPassword: {
      required: "Please confirm your password",
      mustMatch: "password did not match"
    }
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,24}$/)
          ]
        ],
        confirmPassword: ["", [Validators.required]]
      },
      {
        validator: this.mustMatch("password", "confirmPassword")
      }
    );

    this.resetPasswordForm.valueChanges.subscribe(data =>
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
    if (!this.resetPasswordForm) {
      return;
    }
    const form = this.resetPasswordForm;
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
  submit() {
    this.resetPasswordForm.value.token = this.router.parseUrl(
      this.router.url
    ).queryParams.token;
    this.authService
      .resetPassword(
        "user/forgotpassword",
        this.resetPasswordForm.value
      )
      .toPromise()
      .then(res => {
        this.toastr.success(res.message);
        this.router.navigate(["/login"]);
      })
      .catch(err => {
        this.toastr.error(
          "click on forgot password to regenerate link",
          err.error.message
        );
        this.router.navigate(['/login']);
      });
  }
}
