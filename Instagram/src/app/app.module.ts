import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AlertModule } from 'ngx-bootstrap';

import { SpinnerComponent } from './spinner/spinner.component';
import { Welcome } from './welcome/welcome';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    Welcome
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // MatProgressSpinnerModule,
    AlertModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  })
export class AppModule { }
