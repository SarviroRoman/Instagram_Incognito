import { Injectable } from '@angular/core';

import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private websocket: WebSocketSubject<any>;

  public connect(): WebSocketSubject<any> {
    this.websocket = new WebSocketSubject<any>('ws://localhost:8082');
    return this.websocket;
  }

  public emitEvent(event: string, data: any): void {
    this.websocket.next(({
      event: event,
      data
    }));
  }

}
