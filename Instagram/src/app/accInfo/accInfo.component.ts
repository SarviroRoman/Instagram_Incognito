import {Input, Component } from "@angular/core";
import { WebsocketService } from '../web-socket_service';

@Component({
  selector: 'app-accInfo',
  templateUrl: './accInfo.component.html',
  styleUrls: ['./accInfo.component.css'],
})

export class AccInfoComponent {
  @Input() accInfo: object;

  public photo = [];
  public showPhotoButSpinner = false;
  public showPhoto = false;

  constructor (
    private websocketService: WebsocketService,
  ) {}
  
  public getPhoto(name): void {
    this.showPhotoButSpinner = true;
    let subscribeTo = this.websocketService.connect()
    .subscribe(data => {
      if (data['0'] !== undefined) {
        for (let key in data) {
          this.photo.push(data[key]);
        }
        this.showPhotoButSpinner = false;
        this.showPhoto = true;
      }
    });

    let emit = this.websocketService.emitEvent('getMediaByUserName', name);
  }

}