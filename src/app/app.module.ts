import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { LazyLoadModule } from "./modules";
import { BaseModule } from "./base/base.module";
import {DialogModule} from './shared/dialogs/dialog.module';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    BaseModule,
    LazyLoadModule,
    DialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
