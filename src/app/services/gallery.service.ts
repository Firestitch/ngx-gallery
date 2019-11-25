import { Injectable, OnDestroy, Inject, Injector } from '@angular/core';

import { indexOf, guid } from '@firestitch/common';

import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map, takeUntil, take } from 'rxjs/operators';
import { round } from 'lodash-es';


import { get } from 'lodash-es';
import { FsGalleryPreviewDirective } from '../directives/gallery-preview.directive';
import { FsGalleryThumbnailDirective } from '../directives/gallery-thumbnail.directive';
import { GalleryConfig } from '../classes/gallery.config';
import { FsGalleryItem } from '../interfaces/gallery-config.interface';
import { FsGalleryThumbnailContainerDirective } from '../directives/gallery-thumbnail-container.directive';
import { FsGalleryPreviewService } from './gallery-preview.service';
import { Overlay } from '@angular/cdk/overlay';
import { GalleryPreviewComponentInjector } from '../injectors/gallery-preview-component.injector';
import { DragulaService } from 'ng2-dragula';


@Injectable()
export class FsGalleryService implements OnDestroy {

  public dragName = 'fs-gallery-dragular';

  public galleryPreviewService: FsGalleryPreviewService;
  public previewTemplate: FsGalleryPreviewDirective = null;
  public thumbnailTemplate: FsGalleryThumbnailDirective = null;
  public previewDirective: FsGalleryPreviewDirective = null;
  public thumbnailDirective: FsGalleryThumbnailDirective = null;
  public thumbnailContainerDirective: FsGalleryThumbnailContainerDirective = null;

  public imageZoom = 0;
  public imageZoomInteger = 0;
  public dimentionsChange$ = new Subject<void>();
  public reorderStart$: Observable<any>;
  public reorderEnd$: Observable<any>;

  private filterQuery = {};
  private _data$ = new BehaviorSubject<FsGalleryItem[]>([]);
  private _destroy$ = new Subject<void>();
  private _imageWidth: number = null;
  private _imageHeight: number = null;
  private _config: GalleryConfig = null;

  constructor(private _overlay: Overlay,
              private _injector: Injector,
              private _dragulaService: DragulaService,
              @Inject(GalleryPreviewComponentInjector) private _galleryPreviewComponent) {

    this.dragName += guid();

    this.galleryPreviewService = new FsGalleryPreviewService(_overlay, _galleryPreviewComponent, _injector);
    this.reorderStart$ = this._dragulaService.drag(this.dragName);
    this.reorderEnd$ = this._dragulaService.dragend(this.dragName);
  }

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

  public beforeOpenPreview(item: FsGalleryItem) {
    if (this.config.previewBeforeOpen) {
      return this.config.previewBeforeOpen(item);
    }
  }

  public openPreview(item: FsGalleryItem) {
    if (item.galleryMime === 'image') {
      if (this.config.previewOpened) {
        this.config.previewOpened(item);
      }

      this.galleryPreviewService.open(item)
        .onClose
        .pipe(
          take(1),
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          if (this.config.previewClosed) {
            this.config.previewClosed(item);
          }
        });
    }
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

              const link = this.getFileLink(newItem)
                || this.getPreviewImage(newItem)
                || this.getThumbnailImage(newItem);

              if (link) {
                this.detectExtensionType(newItem, link);
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

    this._imageWidth = this.config.imageWidth + (this.imageZoom * this.config.imageWidth);
    this._imageHeight = (this._imageWidth * this.config.imageHeightScale);

    this.dimentionsChange$.next();
  }

  public updateImageZoom(val: number) {
    this.imageZoom = val;
    this.imageZoomInteger = round(val,0);
    this.updateImageDims();
  }

  public getThumbnailImage(data: FsGalleryItem) {
    return get(data, this.config.thumbnailField, null);
  }

  public getPreviewImage(data: FsGalleryItem) {
    return get(data, this.config.imageField, null);
  }

  public getFileLink(data: FsGalleryItem) {
    return get(data, this.config.fileField, null);
  }

  public getName(data: FsGalleryItem) {
    return get(data, this.config.nameField, null);
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
    item.galleryExtension = match ? match[1] : '';

    const imageExtension = item.galleryExtension.match(/(jpe?g|png|gif|tiff?|bmp)/);
    const videoExtension = item.galleryExtension.match(/(mov|avi|wmv|flv|3gp|mp4|mpg)/);

    if (imageExtension) {
      item.galleryMime = 'image';
      item.galleryExtension = imageExtension[0];
    } else if (videoExtension) {
      item.galleryMime = 'video';
      item.galleryExtension = videoExtension[0];
    } else {
      item.galleryMime = 'application'
    }

    item.type = item.galleryMime + '/' + item.extension;
  }
}
