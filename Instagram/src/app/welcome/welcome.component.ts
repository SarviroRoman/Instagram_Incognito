import { Component } from "@angular/core";
import { Router } from '@angular/router';

import {MatSnackBar} from '@angular/material';

import { WebsocketService } from '../web-socket_service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})

export class WelcomeComponent {

  value = '';
  public showButSpinner = false;

  constructor(
    private websocketService: WebsocketService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  public getCheckAccInfo(): void {
  this.showButSpinner = true;

  let subscribeTo = this.websocketService.connect()
    .subscribe(data => {
      if (data['error'] !== undefined) {
        this.showButSpinner = false;
        this.openSnackBar(data['error'], 'Close');
      } else {
        this.router.navigate(['/account'], { queryParams: { name: this.value } });
      }
    });

    let emit = this.websocketService.emitEvent('getProfile', String(this.value));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

}


// emit = this.websocketService.emitEvent('getProfile', 'wlavanda');
// emit = this.websocketService.emitEvent('getProfile', 'bulakh.kirill');
// emit = this.websocketService.emitEvent('getProfile', 'nastyanvcv');