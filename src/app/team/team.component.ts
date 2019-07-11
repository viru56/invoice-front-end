import { Component, OnInit } from '@angular/core';
export interface Iteam {
  id: number;
  name: string;
  emailAddress: string;
  role:string;
}

const TEAM_DATA: Iteam[] = [
  {id:1,name: 'abc', emailAddress:'abc@gmail.com',role:'admin'},
  {id:2,name: 'xyz', emailAddress:'xyz@gmail.com',role:'read only'},
  {id:3,name: 'pqr', emailAddress:'pqr@gmail.com',role:'employee'}
];

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  displayedColumns: string[] = ['name', 'emailAddress', 'role', 'action'];
  dataSource = TEAM_DATA;
  constructor() { }

  ngOnInit() {
  }
  deleteUser(id:number):void{
    console.log(id);
  }
  editUser(id:number):void{
    console.log(id);
  }
}
