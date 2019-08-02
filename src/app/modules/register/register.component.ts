import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/shared/services";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  serverError: string;
  formErrors = {
    email: "",
    // password: "",
    fullName: "",
    companyName: ""
  };
  validationMessages = {
    fullName: {
      required: "Please enter your name"
    },
    companyName: {
      required: "Please enter your company name"
    },
    email: {
      required: "Please enter your email",
      email: "please enter your vaild email"
    }
    // password: {
    //   required: "please enter your password",
    //   minlength: "Please enter more than 6 characters",
    //   maxlength: "Please enter less than 18 characters"
    // }
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tostr: ToastrService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      fullName: ["", [Validators.required]],
      companyName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]]
      // password: ["", [Validators.minLength(6), Validators.maxLength(18)]]
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    this.serverError = null;
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
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
    this.serverError = '';
    this.authService
      .registerCompany(this.userForm.value)
      .toPromise()
      .then(res => {
        console.log(res);
        this.tostr.success(res.message);
      })
      .catch(err => {
        console.log(err);
        if (err.error.errmsg) {
          if (err.error.errmsg.indexOf("email") !== -1) {
            this.serverError = "Email already exists";
          } else if (err.error.errmsg.indexOf("name") !== -1) {
            this.serverError = "Comapny name already exists";
          }
        } else {
          this.serverError = err.error.message
        }
      });
  }
}
