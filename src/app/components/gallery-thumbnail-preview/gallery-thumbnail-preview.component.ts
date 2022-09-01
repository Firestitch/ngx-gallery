import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { FsGalleryService } from '../../services';
import { FsGalleryConfig, FsGalleryItem } from '../../interfaces';
import { GalleryThumbnailSize, MimeType } from '../../enums';


@Component({
  selector: 'fs-gallery-thumbnail-preview',
  templateUrl: './gallery-thumbnail-preview.component.html',
  styleUrls: ['./gallery-thumbnail-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryThumbnailPreviewComponent {

  @Input() public item: FsGalleryItem;
  @Input() public imageHeight: number;
  @Input() public imageWidth: number;

  @Output() public select = new EventEmitter<FsGalleryItem>();

  public MimeType = MimeType;
  public GalleryThumbnailSize = GalleryThumbnailSize;
  public styles = {
    width: null,
    height: null,
  };

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public click(item: FsGalleryItem) {
    if (this.galleryService.config.preview === false) {
      return;
    }

    if (this.select.observers.length) {
      return this.select.emit(this.item);
    }

    if (item.folder) {
      this.galleryService.openItem(item);
    } else {
      if (this.galleryService.config.previewClick) {
        this.galleryService.config.previewClick(item);
      } else {
        const result = this.galleryService.beforeOpenPreview(item);
        if (result !== false) {
          this.galleryService.openPreview(item);
        }
      }
    }
  }

  public get config(): FsGalleryConfig {
    return this.galleryService.config;
  }

}
