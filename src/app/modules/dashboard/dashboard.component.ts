import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {
   //  this.authService.getUserDetails().then(user=>this.currentUser= user).catch(err=> this.authService.logout());
  }

}
