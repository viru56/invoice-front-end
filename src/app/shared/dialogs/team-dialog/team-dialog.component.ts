import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from '../../services';

@Component({
  selector: 'app-team-dialog',
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.scss']
})
export class TeamDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamDialogComponent>,
    private authService:AuthService
  ) {}
  title: string;
  teamForm: FormGroup;
  serverError:string;
  Roles:string[]=['admin','employee']
  ngOnInit() {
    this.data
      ? (this.title = "Edit User")
      : (this.title = "New User");
    this.teamForm = this.fb.group({
      fullName: [{value:this.data ? this.data.fullName : "", disabled:this.data?true:false}, [Validators.required]],
      email: [{value:this.data ? this.data.email : null,disabled:this.data?true:false}, [Validators.required, Validators.email]],
      role: [this.data ? this.data.role : 'admin',[Validators.required]]
    });
  }
  submit(): void {
    this.serverError = '';
    if (this.data) this.teamForm.value.id = this.data.id;
    if (this.data) this.teamForm.value.id = this.data.id;
    this.authService[this.data ? "userRoleUpdate" : "addNewUser"](this.teamForm.value)
      .then(result => {
        this.dialogRef.close(result);
      })
      .catch(err => {
        console.log(err);
        this.serverError =
          err.error.errmsg ||
          err.error.message ||
          "server error: failed to add item";
      });
  }
}