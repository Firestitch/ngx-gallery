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
      this.fsGalleryService.dimentionsChange$.subscribe(() => {
        this.styles.width = this.fsGalleryService.imageWidth + 'px';
        this.styles.height = this.fsGalleryService.imageHeight + 'px';
      });

      this.fsGalleryService.updateImageDims();
    }
  }

  public MimeType = MimeType;
  public item;
  public styles = {
    width: null,
    height: null,
  };

  constructor(
    public fsGalleryService: FsGalleryService,
  ) { }

  public click(item) {

    if (this.select.observers.length) {
      return this.select.emit(this.item);
    }

    if (this.fsGalleryService.config.previewClick) {
      this.fsGalleryService.config.previewClick(item);
    } else {

      const result = this.fsGalleryService.beforeOpenPreview(item);

      if (result !== false) {
        this.fsGalleryService.openPreview(item);
      }
    }
  }

  public preventEventPropagation(event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
