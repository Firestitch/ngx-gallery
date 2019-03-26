import { Injectable, OnDestroy } from '@angular/core';

import { indexOf } from '@firestitch/common';

import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';


import { get } from 'lodash-es';
import { FsGalleryPreviewDirective } from '../directives/gallery-preview.directive';
import { FsGalleryThumbnailDirective } from '../directives/gallery-thumbnail.directive';
import { GalleryConfig } from '../classes/gallery.config';
import { FsGalleryItem } from '../interfaces/gallery-config.interface';


@Injectable()
export class FsGalleryService implements OnDestroy {

  public previewTemplate: FsGalleryPreviewDirective = null;
  public thumbnailTemplate: FsGalleryThumbnailDirective = null;
  public previewDirective: FsGalleryPreviewDirective = null;
  public thumbnailDirective: FsGalleryThumbnailDirective = null;

  public imageZoom = 187;

  public dimentionsChange$ = new Subject<void>();

  private filterQuery = {};

  private _data$ = new BehaviorSubject<FsGalleryItem[]>([]);
  private _destroy$ = new Subject<void>();
  private _imageWidth: number = null;
  private _imageHeight: number = null;
  private _config: GalleryConfig = null;

  constructor() { }

  get data$() {
    return this._data$;
  }

  get config(): GalleryConfig {
    return this._config;
  }

  set config(value: GalleryConfig) {
    this._config = value;
    this._config.filterInit = this.filterInit.bind(this);
    this._config.filterChange = this.filterChange.bind(this);

    this.loadData();
  }

  get imageWidth(): number {
    return this._imageWidth;
  }
  get imageHeight(): number {
    return this._imageHeight;
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public loadData() {
    const query = Object.assign({}, this.filterQuery);

    if (this._config.fetch) {
      this._config
        .fetch(query)
        .pipe(
          takeUntil(this._destroy$),
          map((items: any) => {
            return items.reduce((acc, item) => {
              const newItem = Object.assign({}, item);

              if (newItem.file) {
                this.detectExtensionType(newItem, newItem.file);
              } else {
                const fileName = typeof newItem.image === 'string'
                  ? newItem.image
                  : newItem.image.small;

                this.detectExtensionType(newItem, fileName);
              }

              acc.push(newItem);

              return acc;
            }, []);
          }),
        )
        .subscribe((data) => {
          this.data$.next(data);
        });
    }
  }

  public updateImageDims() {
    this._imageWidth = this.imageZoom;
    // 0.673 - scale koef.
    this._imageHeight = this.imageZoom * 0.673;

    this.dimentionsChange$.next();
  }

  public updateImageZoom(val: number) {
    this.imageZoom = val;

    this.updateImageDims();
  }

  public getThumbnailImage(data: FsGalleryItem) {
    return get(data, this.thumbnailDirective.image, null);
  }

  public getPreviewImage(data: FsGalleryItem) {
    return get(data, this.previewDirective.image, null);
  }

  public getDataIndex(data: FsGalleryItem) {
    return indexOf(this.data$.getValue(), { [this.config.indexField]: data[this.config.indexField] });
  }

  public filterInit(query) {
    this.filterQuery = query;
  }

  public filterChange(query) {
    this.filterQuery = query;

    this.loadData();
  }

  private detectExtensionType(item, fileName) {
    const match = fileName.toLowerCase().match(/([^\.]+)$/);
    item.extension = match ? match[1] : '';

    const imageExtension = item.extension.match(/(jpe?g|png|gif|tiff?|bmp)/);
    const videoExtension = item.extension.match(/(mov|avi|wmv|flv|3gp|mp4|mpg)/);

    if (imageExtension) {
      item.mime = 'image';
      item.extension = imageExtension[0];
    } else if (videoExtension) {
      item.mime = 'video';
      item.extension = videoExtension[0];
    } else {
      item.mime = 'application'
    }

    item.type = item.mime + '/' + item.extension;
  }
}
