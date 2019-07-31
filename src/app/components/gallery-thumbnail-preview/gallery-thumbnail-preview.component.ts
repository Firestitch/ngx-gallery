import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';

@Component({
  selector: 'fs-gallery-thumbnail-preview',
  templateUrl: './gallery-thumbnail-preview.component.html',
  styleUrls: [ './gallery-thumbnail-preview.component.scss' ]
})
export class FsGalleryThumbnailPreviewComponent implements OnInit {

  @Input() public carousel = false;
  @Output() public select = new EventEmitter<FsGalleryItem>();
  @Input('item') set setItem(item: FsGalleryItem) {

    this.item = item;

    this.image = this.fsGalleryService.getThumbnailImage(this.item);

    if (!this.carousel) {
      this.fsGalleryService.dimentionsChange$.subscribe(() => {
        this.styles.width = this.fsGalleryService.imageWidth + 'px';
        this.styles.height = this.fsGalleryService.imageHeight + 'px';
      });

      this.fsGalleryService.updateImageDims();
    }
  }

  public item;
  public image: string = null;
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
      this.fsGalleryService.openPreview(item);
    }
  }
  public preventEventPropagation(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  ngOnInit() {

  }
}
