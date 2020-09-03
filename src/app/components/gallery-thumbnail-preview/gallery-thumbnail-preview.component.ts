import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { MimeType } from '../../enums';


@Component({
  selector: 'fs-gallery-thumbnail-preview',
  templateUrl: './gallery-thumbnail-preview.component.html',
  styleUrls: [ './gallery-thumbnail-preview.component.scss' ]
})
export class FsGalleryThumbnailPreviewComponent {

  @Input() public carousel = false;
  @Output() public select = new EventEmitter<FsGalleryItem>();
  @Input('item') set setItem(item: FsGalleryItem) {

    this.item = item;

    if (!this.carousel) {
      this.galleryService.dimentionsChange$.subscribe(() => {
        this.styles.width = this.galleryService.imageWidth + 'px';
        this.styles.height = this.galleryService.imageHeight + 'px';
      });

      this.galleryService.updateImageDims();
    }
  }

  public MimeType = MimeType;
  public item;
  public styles = {
    width: null,
    height: null,
  };

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public click(item) {

    if (this.select.observers.length) {
      return this.select.emit(this.item);
    }

    if (this.galleryService.config.previewClick) {
      this.galleryService.config.previewClick(item);
    } else {
      const result = this.galleryService.beforeOpenPreview(item);
      if (result !== false) {
        this.galleryService.openPreview(item);
      }
    }
  }

  public preventEventPropagation(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  public imageLoad(event, item): void {
    if (event.target.height > event.target.width) {
      item.portrait = true;
    }
  }
}
