import { Component, HostListener, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { PREVIEW_DATA } from '../../services/preview-data';
import { FsGalleryPreviewRef } from '../../classes/gallery-preview-ref';


@Component({
  selector: 'fs-gallery-preview',
  templateUrl: './gallery-preview.component.html',
  styleUrls: [ './gallery-preview.component.scss' ]
})
export class FsGalleryPreviewComponent implements OnInit, OnDestroy {

  public totalImages = 0;
  public activeImageIndex = 0;
  public availableImages: FsGalleryItem[];
  public image: string = null;
  public imageHover = false;

  public hasManyItems = false;

  public activeItem: FsGalleryItem;

  @HostListener('document:keydown', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 27:
        this.previewRef.close();
        break;
      case 37:
        this.prev();
        break;
      case 39:
        this.next();
        break;
    }
  }

  constructor(
    public renderer: Renderer2,
    public galleryService: FsGalleryService,
    @Inject(PREVIEW_DATA) data: FsGalleryItem,
    private previewRef: FsGalleryPreviewRef,
  ) {
    this._initAvailableImages();
    this.setActiveItem(data);
  }

  public ngOnInit() {
    this.renderer.addClass(document.body, 'fs-gallery-preview-open');
  }

  public ngOnDestroy() {
    this.renderer.removeClass(document.body, 'fs-gallery-preview-open');
  }

  public close() {
    this.previewRef.close();
  }

  public prev() {

    const data = this.galleryService.data$.getValue();

    const images = data.filter((item: FsGalleryItem) => {
      return item.galleryMime === 'image';
    });

    const index = images.indexOf(this.activeItem);

    let prev = null;
    if (index >= 0) {
      const prevImages = images.filter((item: FsGalleryItem, idx) => {
        return idx < index;
      });

      prev = prevImages.pop();
    }

    if (!prev) {
      prev = images.pop();
    }

    this.setActiveItem(prev);
  }

  public next() {

    const data = this.galleryService.data$.getValue();

    const images = data.filter((item: FsGalleryItem) => {
      return item.galleryMime === 'image';
    });

    const index = images.indexOf(this.activeItem);

    let next = null;
    if (index >= 0) {
      next = images.filter((item: FsGalleryItem, idx) => {
        return idx > index;
      })[0];
    }

    if (!next) {
      next = images[0];
    }

    this.setActiveItem(next);
  }

  public imageClick($event) {
    const cursorX = $event.clientX;
    const imageWidth = $event.target.width;
    const windowWidth = $event.view.innerWidth;
    if (cursorX <= (windowWidth / 2)) {
      this.prev();
    } else {
      this.next();
    }
  }

  public setActiveItem(data: FsGalleryItem) {
    this.activeItem = data;
    this.image = this.galleryService.getPreviewImage(data);
    this.activeImageIndex = this.availableImages.indexOf(data) + 1;
  }

  private _initAvailableImages() {
    this.availableImages = this.galleryService.data$.getValue().filter((item: FsGalleryItem) => {
      return item.galleryMime === 'image';
    });

    this.hasManyItems = this.availableImages.length > 1;

    this.totalImages = this.availableImages.length;
  };
}
