import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  userForm: FormGroup;
  formErrors = {
    email: "",
    password: ""
  };
  validationMessages = {
    firstName: {
      required: "Please enter your name"
    },
    companyName: {
      required: "Please enter your company name"
    },
    email: {
      required: "Please enter your email",
      email: "please enter your vaild email"
    },
    password: {
      required: "please enter your password",
      minlength: "Please enter more than 6 characters",
      maxlength: "Please enter less than 18 characters"
    }
  };

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      firstName: ["", [Validators.required]],
      companyName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.minLength(6), Validators.maxLength(18)]]
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
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
    this.router.navigate(["/auth/dashboard"]);
  }
}
