import { Component } from '@angular/core';

import { WebsocketService } from './web-socket_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Instagram';
  data;
  constructor (
    private websocketService: WebsocketService,
  ) {}
  
  subscribeTo = this.websocketService.connect()
    .subscribe(data => {
      this.data=data;
    });

  
  emit = this.websocketService.emitEvent('getProfile', 'nrbna');

}
