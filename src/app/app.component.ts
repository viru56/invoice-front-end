import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ind-invoice';
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation
}
}
