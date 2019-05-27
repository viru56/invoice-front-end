import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import {
  MatListModule,
  MatSidenavModule,
  MatSliderModule,
  MatProgressBarModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatToolbarModule,
  MatChipsModule,
  MatFormFieldModule,
  MatTabsModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SidemenuComponent } from "./sidemenu/sidemenu.component";
import { SidemenuItemComponent } from "./sidemenu-item/sidemenu-item.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ToolbarNotificationComponent } from "./toolbar-notification/toolbar-notification.component";
import { RouterModule } from '@angular/router';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    SidemenuComponent,
    SidemenuItemComponent,
    UserMenuComponent,
    ToolbarComponent,
    ToolbarNotificationComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatProgressBarModule,
    RouterModule
  ],
  exports: [
    SidemenuComponent,
    SidemenuItemComponent,
    ToolbarNotificationComponent,
    ToolbarComponent,
    UserMenuComponent
],

providers: [
    {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
]
})
export class BaseModule {}
