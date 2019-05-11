import { Component } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../web-socket_service';

@Component({
  selector: 'app-accInfo',
  templateUrl: './accInfo.component.html',
  styleUrls: ['./accInfo.component.css'],
})

export class AccInfoComponent {

  public photo = [];
  public accInfo: object;
  public name = 'nastyanvcv';

  public showSpinner = false;
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

  constructor(
    private websocketService: WebsocketService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(){
    this.showSpinner = true;

    this.route
    .queryParams
    .subscribe(params => {
      this.name = params['name'] || 'nastyanvcv';
    });
    
    this.getAcc(this.name);
  }
  
  public getAcc(name): void {
    let subscribeTo = this.websocketService.connect()
      .subscribe(data => {
        if (data['isPrivate'] !== undefined) {
          this.accInfo = data;
          this.showSpinner = false;

          if (this.accInfo['isPrivate'] === true) {
            this.showPhotoBut = false;
            this.showPrivate = true;
          } else if (this.accInfo['mediaCount'] === 0) {
            this.showPhotoBut = false;
            this.showEmptu = true;
          }
        }
        this.showPhotoButSpinner = true;
        if (data['0'] !== undefined) {
          for (let key in data) {
            if (data[key].getCaption.length >= 60) {
              data[key].getCaption = data[key].getCaption.slice(0, 60) + ' ...';
            }
            this.photo.push(data[key]);
            this.showPhotoButSpinner = false;
          }
        }
      });

    let emit = this.websocketService.emitEvent('getProfile', String(name));
  }

  public getPhoto(name): void {
    this.collectionSize = this.photo.length;
    this.showPhoto = true;
    this.showPhotoBut = false;
    this.showPagination = true;
  }

  public getAccUrl(name){
    return `https://www.instagram.com/${name}`;
  }

}