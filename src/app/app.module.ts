import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { LazyLoadModule } from "./lazy-load/lazy-load.module";
import { BaseModule } from "./base/base.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    BaseModule,
    LazyLoadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
