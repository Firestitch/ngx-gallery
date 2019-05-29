import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FsGalleryItem } from '../../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery-preview-carousel',
  templateUrl: './gallery-preview-carousel.component.html',
  styleUrls: [ './gallery-preview-carousel.component.scss' ]
})
export class FsGalleryPreviewCarouselComponent {

  @Input()
  public data: FsGalleryItem[];

  @Input()
  public activeItem: FsGalleryItem[];

  @Output()
  public previewSelected = new EventEmitter<FsGalleryItem>();

  public onSelect(data: FsGalleryItem) {
    this.previewSelected.emit(data);
  }

}
