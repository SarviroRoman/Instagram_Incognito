import { Component } from '@angular/core';

import { WebsocketService } from './web-socket_service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Instagram';

  constructor (
    private websocketService: WebsocketService,
  ) {}

  subscribeTo = this.websocketService.connect()
    .subscribe(data => console.log(data));

  emit = this.websocketService.emitEvent('getMediaByUserName', 'nrbna');
}
