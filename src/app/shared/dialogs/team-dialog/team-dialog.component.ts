import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-team-dialog',
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.scss']
})
export class TeamDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamDialogComponent>
  ) {}
  title: string;
  teamForm: FormGroup;
  Roles:string[]=['admin','readOnly','employee']
  ngOnInit() {
    this.data
      ? (this.title = "Edit User")
      : (this.title = "New User");
    this.teamForm = this.fb.group({
      name: [{value:this.data ? this.data.name : "", disabled:this.data?true:false}, [Validators.required]],
      emailAddress: [{value:this.data ? this.data.emailAddress : null,disabled:this.data?true:false}, [Validators.required, Validators.email]],
      role: [this.data ? this.data.role : 'admin',[Validators.required]]
    });
  }
  submit(): void {
    if(this.data){
      this.teamForm.value.id = this.data.id;
    }
    this.dialogRef.close(this.teamForm.value);
  }
}