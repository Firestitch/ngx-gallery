import { Component, Input, Output, EventEmitter } from '@angular/core';

import { GalleryMode } from './../../enums/gallery-mode.enum';
import { FsGalleryService } from '../../services/gallery.service';

@Component({
  selector: 'fs-gallery-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
})
export class FsGalleryHeaderComponent {

  @Input() public allow;
  @Input() public filterConfig;
  @Input() public mode: GalleryMode;
  @Input('upload') public uploadCallback;
  @Input('zoom') public zoomEnabled;

  @Output() public modeChange = new EventEmitter();

  public zoom = this.galleryService.imageZoom;
  public data$ = this.galleryService.data$;
  public GalleryMode = GalleryMode;

  constructor(public galleryService: FsGalleryService) {}

  public updateImageZoom(value: number) {
    this.galleryService.updateImageZoom(value);
  }

  public upload(file) {
    this.uploadCallback(file);
  }
}
