import { Component } from '@angular/core';

import { WebsocketService } from './web-socket_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Instagram';
  public data;
  public showSpinner = true;
  constructor (
    private websocketService: WebsocketService,
  ) {}
  
  subscribeTo = this.websocketService.connect()
    .subscribe(data => {
      setTimeout(() => {
        this.data = data;
        this.showSpinner = false;
      }, 3000);
    });

  
  emit = this.websocketService.emitEvent('getProfile', 'nrbna');

}
