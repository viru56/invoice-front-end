import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TeamDialogComponent, DialogConfig } from "../../shared/dialogs";
import { Iteam, Iuser } from "../../shared/models";
import { MatTableDataSource } from "@angular/material";
import { AuthService } from "../../shared/services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"]
})
export class TeamComponent implements OnInit {
  displayedColumns: string[] = [
    "fullName",
    "email",
    "role",
    "status",
    "action"
  ];
  dataSource: MatTableDataSource<Iuser>;
  itemLoading: string;
  currentUser: Iuser;
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.itemLoading = "loading...";
    this.dataSource = new MatTableDataSource([]);
    this.getAllUsers();
    this.authService.getUserDetails().then(user=>this.currentUser = user,err=>console.log(err));
  }
  getAllUsers(): void {
    this.authService
      .getUserStore()
      .then(items => {
        this.dataSource.data = items;
        if (items.length === 0) {
          this.itemLoading = "No User Found";
        }
      })
      .catch(err => {
        console.log(err);
        this.itemLoading = `Server Error:   ${err.statusText}`;
        this.toastr.error("faild to load users", "Server Error");
      });
  }
  addNewUser(): void {
    if(this.currentUser.role !=='admin'){
      this.toastr.info('you do not privilage!');
      return;
    }
    DialogConfig.data = null;
    const dialogRef = this.dialog.open(TeamDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            this.toastr.success(
              "New user account is created and send a mail to set password!"
            );
            this.getAllUsers();
          }
        },
        err => console.log(err)
      );
  }
  deleteUser(index: number, id: string): void {
    if(this.currentUser.role !=='admin'){
      this.toastr.info('you do not privilage!');
      return;
    }
    this.authService
      .deleteUser(index, id)
      .then(() => {
        this.getAllUsers();
        this.toastr.success("User is deleted!");
      })
      .catch(err => {
        console.log(err);
        this.toastr.error("Failed to delete user!", "Server error");
      });
  }
  editUser(user: Iteam): void {
    if(this.currentUser.role !=='admin'){
      this.toastr.info('you do not privilage!');
      return;
    }
    DialogConfig.data = user;
    const dialogRef = this.dialog.open(TeamDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if (result) {
            this.toastr.success("User is updated!");
            this.getAllUsers();
          }
        },
        err => console.log(err)
      );
  }
}
