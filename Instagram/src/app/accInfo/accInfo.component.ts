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
  public showPhotoBut = true;
  public showPrivate = false;
  public showEmptu = false;
  public showPagination = false;

  public page = 1;
  public pageSize = 12;
  public maxSize = 5;
  public collectionSize: number;

  constructor (
    private websocketService: WebsocketService,
  ) {}

  ngOnInit(){
    if (this.accInfo['isPrivate'] === true) {
      this.showPhotoBut = false;
      this.showPrivate = true;
    } else if (this.accInfo['mediaCount'] === 0) {
      this.showPhotoBut = false;
      this.showEmptu = true;
    }
  }
  
  public getPhoto(name): void {
    this.showPhotoButSpinner = true;
    let subscribeTo = this.websocketService.connect()
    .subscribe(data => {
      if (data['0'] !== undefined) {
        for (let key in data) {
          if (data[key].getCaption.length >= 60) {
            data[key].getCaption = data[key].getCaption.slice(0, 60) + ' ...';
          }
          this.photo.push(data[key]);
        }
        this.showPhotoButSpinner = false;
        this.showPhoto = true;
        this.showPhotoBut = false;
        this.showPagination = true;
      }
    });

    let emit = this.websocketService.emitEvent('getMediaByUserName', name);
  }

  public getAccUrl(name){
    return `https://www.instagram.com/${name}`;
  }

}