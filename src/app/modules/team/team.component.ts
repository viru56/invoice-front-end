import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { TeamDialogComponent, DialogConfig } from "../../shared/dialogs";
import { Iteam } from '../../shared/models';
import { MatTableDataSource } from '@angular/material';

const TEAM_DATA: Iteam[] = [
  {id:1,name: 'abc', emailAddress:'abc@gmail.com',role:'admin'},
  {id:2,name: 'xyz', emailAddress:'xyz@gmail.com',role:'readOnly'},
  {id:3,name: 'pqr', emailAddress:'pqr@gmail.com',role:'employee'}
];

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  displayedColumns: string[] = ['name', 'emailAddress', 'role', 'action'];
  dataSource: MatTableDataSource<Iteam>;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(TEAM_DATA);
  }
  addNewUser():void{
      DialogConfig.data = null;
      const dialogRef = this.dialog.open(TeamDialogComponent, DialogConfig);
      dialogRef
        .afterClosed()
        .toPromise()
        .then(
          result => {
            if(result){
              result.id = TEAM_DATA.length + 1;
              TEAM_DATA.push(result);
              this.dataSource.data = TEAM_DATA;
            }
          },
          err => console.log(err)
        );
  }
  deleteUser(index:number):void{
    TEAM_DATA.splice(index,1);
    this.dataSource.data = TEAM_DATA;
  }
  editUser(user:Iteam):void{
    DialogConfig.data = user;
    const dialogRef = this.dialog.open(TeamDialogComponent, DialogConfig);
    dialogRef
      .afterClosed()
      .toPromise()
      .then(
        result => {
          if(result){
            for(let item of TEAM_DATA){
              if(item.id === result.id){
                item.role = result.role
              }
            }
          }
        },
        err => console.log(err)
      );
  }
}
