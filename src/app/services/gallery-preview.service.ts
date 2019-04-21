import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { FsGalleryDataItem } from '../interfaces/gallery-data-item.interface';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'lodash-es';
import { FsGalleryItem } from '../interfaces/gallery-config.interface';


@Injectable()
export class FsGalleryPreviewService implements OnDestroy {

  private _data: BehaviorSubject<FsGalleryDataItem> = new BehaviorSubject<FsGalleryDataItem>(null);

  public data$ = this._data.asObservable();

  private dataItem: FsGalleryDataItem = null;
  private renderer: Renderer2;
  private _instance = null;
  private _destroy$ = new Subject();

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((data: FsGalleryDataItem) => this.dataItem = data);
  }

  set instance(value) {

    if (value && this._instance) {
      this.close();
    }

    this._instance = value;
    this.renderer.addClass(document.body, 'fs-gallery-preview-open');
  }

  get instance() {
    return this._instance;
  }

  get opened() {
    return !!this.instance;
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  setData(data: FsGalleryDataItem) {
    this._data.next(data);
  }

  prev() {

    const data = this.instance.instance.galleryService.data$.getValue();

    const images = filter(data, (item: FsGalleryItem) => {
                      return item.galleryMime === 'image';
                    });

    const index = images.indexOf(this.dataItem);

    let prev = null;
    if (index >= 0) {
      const prevImages = filter(images, (item: FsGalleryItem, idx) => {
        return idx < index;
      });

      prev = prevImages.pop();
    }

    if (!prev) {
      prev = images.pop();
    }

    return this.setData(prev);
  }

  next() {

    const data = this.instance.instance.galleryService.data$.getValue();

    const images = filter(data, (item: FsGalleryItem) => {
                      return item.galleryMime === 'image';
                    });

    const index = images.indexOf(this.dataItem);

    let next = null;
    if (index >= 0) {
      next = filter(images, (item: FsGalleryItem, idx) => {
        return idx > index;
      })[0];
    }

    if (!next) {
      next = images[0];
    }

    return this.setData(next);
  }

  close() {
    this.renderer.removeClass(document.body, 'fs-gallery-preview-open');
    this.instance.destroy();
  }
}
