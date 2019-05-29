import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FsGalleryItem } from '../../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './gallery-preview-header.component.html',
  styleUrls: [ './gallery-preview-header.component.scss' ]
})
export class FsGalleryPreviewHeaderComponent {

  @Input()
  public totalItems = 0;

  @Input()
  public activeIndex = 0;

  @Output()
  public close = new EventEmitter<void>();

  public closePreview() {
    this.close.next();
  }

}
