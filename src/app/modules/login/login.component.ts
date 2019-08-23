import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/shared/services";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  serverError: string;
  formErrors = {
    email: "",
    password: ""
  };
  validationMessages = {
    email: {
      required: "Please enter your email",
      email: "please enter your vaild email"
    },
    password: {
      required: "please enter your password"
    }
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });

    this.loginForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    this.serverError = "";
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
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
    this.serverError = "";
    this.authService.login(this.loginForm.value).subscribe(
      data => {
        this.router.navigate(["/auth/dashboard"]);
      },
      err => {
        console.log(err);
        this.serverError = err.error.message;
      }
    );
  }
}
