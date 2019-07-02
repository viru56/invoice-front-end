import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
  MatTabsModule,
  MatDividerModule,
  MatCheckboxModule,
  MatStepperModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatCardModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatMenuModule,
  MatTooltipModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SidemenuComponent } from "./sidemenu/sidemenu.component";
import { SidemenuItemComponent } from "./sidemenu-item/sidemenu-item.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ToolbarNotificationComponent } from "./toolbar-notification/toolbar-notification.component";
import { RouterModule } from "@angular/router";

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
    RouterModule,
    MatDividerModule,
    MatCheckboxModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCardModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule
  ],
  exports: [
    CommonModule,
    SidemenuComponent,
    SidemenuItemComponent,
    ToolbarNotificationComponent,
    ToolbarComponent,
    UserMenuComponent,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatChipsModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatTabsModule,
    MatSliderModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCardModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class BaseModule {}
