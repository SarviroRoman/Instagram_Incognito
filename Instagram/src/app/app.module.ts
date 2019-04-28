import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { AlertModule } from 'ngx-bootstrap';

import { SpinnerComponent } from './spinner/spinner.component';
import { Welcome } from './welcome/welcome';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    Welcome,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  })
export class AppModule { }
