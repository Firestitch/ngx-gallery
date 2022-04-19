import { Inject, Injectable, Injector, OnDestroy, TemplateRef } from '@angular/core';

import { Location } from '@angular/common';

import { guid, getNormalizedPath } from '@firestitch/common';
import { FsListConfig, FsListNoResultsConfig, ReorderStrategy } from '@firestitch/list';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, map, skip, take, takeUntil, tap } from 'rxjs/operators';
import { round } from 'lodash-es';


import { FsGalleryPreviewDirective } from '../directives/gallery-preview.directive';
import { FsGalleryThumbnailDirective } from '../directives/gallery-thumbnail.directive';
import { GalleryConfig } from '../classes/gallery.config';
import { FsGalleryItem } from '../interfaces/gallery-config.interface';
import { FsGalleryPreviewService } from './gallery-preview.service';
import { Overlay } from '@angular/cdk/overlay';
import { GalleryPreviewComponentInjector } from '../injectors/gallery-preview-component.injector';
import { DragulaService } from 'ng2-dragula';
import { MimeType } from '../enums';
import { mime } from '../helpers/mime';
import { PersistanceController } from '../classes/persistance-controller';
import { FsGalleryPersistance } from '../interfaces/gallery-persist-config.interface';
import { ThumbnailScale } from '../enums/thumbnail-scale.enum';
import { FsGalleryListColumnDirective } from '../directives/column/column.directive';
import { FilterConfig } from '@firestitch/filter';


@Injectable()
export class FsGalleryService implements OnDestroy {

  public dragName = 'fs-gallery-dragular';

  public galleryPreviewService: FsGalleryPreviewService;
  public previewTemplate: FsGalleryPreviewDirective = null;
  public thumbnailTemplate: TemplateRef<any> = null;
  public previewDirective: FsGalleryPreviewDirective = null;
  public thumbnailDirective: FsGalleryThumbnailDirective = null;
  public thumbnailContainerTemplate: TemplateRef<any> = null;

  public imageZoom = 0;
  public imageZoomInteger = 0;
  public dimentionsChange$ = new Subject<void>();
  public reorderStart$: Observable<any>;
  public reorderEnd$: Observable<any>;
  public listConfig: FsListConfig;
  public filterConfig: FilterConfig;

  private _activeFilters$ = new BehaviorSubject(0);
  public activeFilters$ = this._activeFilters$
    .pipe(
      debounceTime(200),
    )

  private _filterQuery = {};
  private _data$ = new BehaviorSubject<FsGalleryItem[]>([]);
  private _imageWidth: number = null;
  private _imageHeight: number = null;
  private _config: GalleryConfig = null;

  private _configUpdated$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _location: Location,
    private _dragulaService: DragulaService,
    private _persistanceController: PersistanceController,
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
    this._initFilterConfig();
    this._configUpdated$.next();

    if (this._config.persist) {
      this._restorePersistance(this._config.persist);
    }

    if (this._persistanceController.enabled) {
      this._restoreThumbnailScaleParams(this._persistanceController.getDataFromScope('thumbnailScale'));
    }

    this._listenSizeChange();
    this._listenUpload();

    if(this.config.viewModeGallery) {
      this.loadGallery();
    }
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

  public loadGallery() {
    const query = {
      ...this._filterQuery,
    };

    if (this._config.fetch) {
      this._config
        .fetch(query)
        .pipe(
          takeUntil(this._destroy$),
          map((items: any) => this.mapData(items)),
        )
        .subscribe((data) => {
          this.data$.next(data);
        });
    }
  }

  public reload() {
    if(this._config.viewModeGallery) {
      this.loadGallery();
    } else if (this._config.viewModeList) {
      this._config.listRef.reload();
    }
  }

  public mapData(items) {
    return items.map((item) => {
      const mapping: any = this.config.map(item);
      mapping.data = item;

      if (!mapping.mime) {
        mapping.mime = mime(mapping.name, mapping.url);
      }

      return mapping;
    });
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
    this._filterQuery = query;
    this._activeFilters$.next(Object.keys(query).length);
  }

  public filterChange(query) {
    this._filterQuery = query;
    this._activeFilters$.next(Object.keys(query).length);
  }

  public setListColumns(columns: FsGalleryListColumnDirective[]): void {
    this.config.setListColumns(columns);
  }
  private _initFilterConfig() {
    this.filterConfig = {
      items: this.config.filterConfig.items,
      init: this.filterInit.bind(this),
      change: (query) => {
        this.filterChange(query);
        this.reload();
      },
      actions: this.config.filterConfig.actions,
      reload: () => {
        this.reload();
      },
    };
  }

  private _initListConfig() {
    this.listConfig = {
      rowActions: this.config.info?.menu?.actions,
      paging: false,
      selection: this.config.selection,
      reorder: {
        strategy: ReorderStrategy.Always,
        done: (rows) => {
          const rowsData = rows.map((row) => {
            return row.data;
          });
          
          this.data$.next(rowsData);
          this.config.reorderEnd(rowsData);
        }
      },
      status: false,
      fetch: (query) => {
        return this.config.fetch(query)
          .pipe(
            map((items: unknown[]) => {
              return items.map(item => {
                const mapping: any = this.config.map(item);
                mapping.data = item;
                mapping.mime = mime(mapping.name, mapping.url);
                return mapping;
              });
            }),
            map((items: FsGalleryItem[]) => { 
              this.data$.next(items);          
              return {
                data: items,
                paging: { records: items.length },
              }
            }),
          );
      }
    };

    if (this.config.noResults !== undefined) {
      this.listConfig.noResults = this.config.noResults as FsListNoResultsConfig;
    }
  }

  private _listenUpload(): void {
    this.config.upload$
    .pipe(
      takeUntil(this._destroy$),
    )
    .subscribe(() => {
      this.reload();
    });
  }
  
  private _listenSizeChange() {
    this._config.thumbnailScale$
      .pipe(
        takeUntil(this._configUpdated$),
        takeUntil(this._destroy$),
      )
      .subscribe((size) => {
        if (this._persistanceController.enabled) {
          this._persistanceController.saveDataToScope('thumbnailScale', size);
        }

        switch (size) {
          case ThumbnailScale.Small: {
            this.config.viewModeGallery
              ? this.updateImageZoom(-0.1)
              : this.updateImageZoom(-0.7);
          }
            break;

          case ThumbnailScale.Medium: {
            this.config.viewModeGallery
              ? this.updateImageZoom(1.3)
              : this.updateImageZoom(-0.2);
          }
            break;

          case ThumbnailScale.Large: {
            this.config.viewModeGallery
              ? this.updateImageZoom(3)
              : this.updateImageZoom(0.3);
          }
            break;

          case ThumbnailScale.None: {
            this.config.viewModeGallery
              ? this.updateImageZoom(0)
              : this.updateImageZoom(0);
          }
            break;
        }
      });
  }

  private _restorePersistance(persistConfig: FsGalleryPersistance): void {
    const namespace = getNormalizedPath(this._location);
    this._persistanceController.setConfig(persistConfig, namespace);
  }

  private _restoreThumbnailScaleParams(value: ThumbnailScale) {
    if (value) {
      this._config.setThumbnailScale(value);
    }
  }

}
