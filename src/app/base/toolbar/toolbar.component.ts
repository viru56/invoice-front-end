import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() sidenav;
	@Input() drawer;
  @Input() matDrawerShow;
  data = {
    notifications: [
      {
        id: 'id',
        title: 'This is a test message',
        lastTime: '23 Minutes ago',
        state: 'state'
      }
    ],
    
    currentUser: {
      photoURL: 'assets/default-user.png',
      currentUserName: 'Virender'
    }
  }
  constructor() { }
  
  ngOnInit() {
  }

}
