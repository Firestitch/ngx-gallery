import { Component, Input } from '@angular/core';

import { FsGalleryService } from '../../services/gallery.service';


@Component({
  selector: 'fs-gallery-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
})
export class FsGalleryHeaderComponent {

  @Input() public filterConfig;
  @Input('upload') public uploadCallback;
  @Input('zoom') public zoomEnabled;

  public zoom = this.galleryService.imageZoom;
  public data$ = this.galleryService.data$;

  constructor(public galleryService: FsGalleryService) {}


  public updateImageZoom(value: number) {
    this.galleryService.updateImageZoom(value);
  }

  public upload(file) {
    this.uploadCallback(file);
  }
}
