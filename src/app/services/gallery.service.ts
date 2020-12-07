import { Inject, Injectable, Injector, OnDestroy } from '@angular/core';

import { guid } from '@firestitch/common';
import { FsListConfig, ReorderStrategy } from '@firestitch/list';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { round } from 'lodash-es';


import { FsGalleryPreviewDirective } from '../directives/gallery-preview.directive';
import { FsGalleryThumbnailDirective } from '../directives/gallery-thumbnail.directive';
import { GalleryConfig } from '../classes/gallery.config';
import { FsGalleryItem } from '../interfaces/gallery-config.interface';
import { FsGalleryThumbnailContainerDirective } from '../directives/gallery-thumbnail-container.directive';
import { FsGalleryPreviewService } from './gallery-preview.service';
import { Overlay } from '@angular/cdk/overlay';
import { GalleryPreviewComponentInjector } from '../injectors/gallery-preview-component.injector';
import { DragulaService } from 'ng2-dragula';
import { MimeType } from '../enums';
import { mime } from '../helpers/mime';


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
  public mode;
  public imageZoomInteger = 0;
  public dimentionsChange$ = new Subject<void>();
  public reorderStart$: Observable<any>;
  public reorderEnd$: Observable<any>;
  public listConfig: FsListConfig;

  private filterQuery = {};
  private _data$ = new BehaviorSubject<FsGalleryItem[]>([]);
  private _imageWidth: number = null;
  private _imageHeight: number = null;
  private _config: GalleryConfig = null;

  private _configUpdated$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _dragulaService: DragulaService,
    @Inject(GalleryPreviewComponentInjector) private _galleryPreviewComponent,
  ) {

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
    this._initListConfig();
    this._configUpdated$.next();
    this._listenSizeChange();
  }

  get imageWidth(): number {
    return this._imageWidth;
  }
  get imageHeight(): number {
    return this._imageHeight;
  }

  public ngOnDestroy() {
    this._configUpdated$.complete();

    this._destroy$.next();
    this._destroy$.complete();
  }

  public beforeOpenPreview(item: FsGalleryItem) {
    if (this.config.previewBeforeOpen) {
      return this.config.previewBeforeOpen(item);
    }
  }

  public openPreview(item: FsGalleryItem) {
    if (item.mime.type === MimeType.Image) {
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

            return items.map(item => {

              const mapping: any = this.config.map(item);
              mapping.data = item;
              const link = mapping.preview || mapping.url;

              if (!mapping.mime) {
                mapping.mime = mime(link);
              }

              return mapping;
            });
          }),
        )
        .subscribe((data) => {
          this.data$.next(data);
        });
    }
  }

  public updateImageDims() {

    this._imageWidth = this.config.thumbnail.width + (this.imageZoom * this.config.thumbnail.width);
    this._imageHeight = (this._imageWidth * this.config.thumbnail.heightScale);

    this.dimentionsChange$.next();
  }

  public updateImageZoom(val: number) {
    this.imageZoom = val;
    this.imageZoomInteger = round(val, 0);
    this.updateImageDims();

    if (this.config.zoomChanged) {
      this.config.zoomChanged(val);
    }
  }

  public filterInit(query) {
    this.filterQuery = query;
  }

  public filterChange(query) {
    this.filterQuery = query;

    // this.loadData();
  }

  private _initListConfig() {
    this.listConfig = {
      filters: this.config.filterConfig.items,
      actions: this.config.filterConfig.actions,
      rowActions: this.config.info?.menu?.actions,
      paging: false,
      selection: this.config.selection,
      reorder: {
        strategy: ReorderStrategy.Always,
        done: (rows) => {
          const rowsData = rows.map((row) => {
            return row.data;
          });

          this.config.reorderEnd(rowsData);
        }
      },
      fetch: (query) => {
        return this.config.fetch(query)
          .pipe(
            map((items: unknown[]) => {

              return items.map(item => {

                const mapping: any = this.config.map(item);
                mapping.data = item;
                const link = mapping.preview || mapping.url;

                if (!mapping.mime) {
                  mapping.mime = mime(link);
                }

                return mapping;
              });
            }),
            map((items: FsGalleryItem[]) => {
              this.data$.next(items);

              return {
                data: items,
                paging: {},
              }
            })
          );
      }
    }
  }

  private _listenSizeChange() {
    this._config.sizeMode$
      .pipe(
        takeUntil(this._configUpdated$),
        takeUntil(this._destroy$),
      )
      .subscribe((size) => {
        switch (size) {
          case 'small': {
            this.updateImageZoom(-0.4);
          }
            break;

          case 'medium': {
            this.updateImageZoom(1.3);
          }
            break;

          case 'large': {
            this.updateImageZoom(3);
          }
            break;
        }
      });
  }
}
