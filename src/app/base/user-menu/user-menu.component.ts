import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { AuthService } from '../../shared/services';
import { Iuser } from 'src/app/shared/models';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  isOpen: boolean = false;

  defaultUser = '';
  

  @Input() currentUser:Iuser = null;
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
       return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
        this.isOpen = false;
    }
  }

  constructor(private elementRef: ElementRef, private authService:AuthService) { }

  ngOnInit() {
    this.authService.getUserDetails().then(user=>this.currentUser= user,(err)=> console.log(err));
  }
  logout(){
    this.authService.logout();
  }
}
