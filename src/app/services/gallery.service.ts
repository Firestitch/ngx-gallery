import { Location } from '@angular/common';
import { Inject, Injectable, Injector, OnDestroy, TemplateRef } from '@angular/core';

import { Overlay } from '@angular/cdk/overlay';

import { getNormalizedPath, guid } from '@firestitch/common';
import { FilterComponent, FilterConfig } from '@firestitch/filter';
import { HtmlClassRenderer } from '@firestitch/html';
import {
  FsListComponent,
  FsListConfig,
  FsListNoResultsConfig,
} from '@firestitch/list';

import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';


import { FsGalleryPreviewRef } from '../classes/gallery-preview-ref';
import { GalleryConfig } from '../classes/gallery.config';
import { PersistanceController } from '../classes/persistance-controller';
import { FsGalleryPreviewDetailsDirective } from '../directives';
import { FsGalleryListColumnDirective } from '../directives/column.directive';
import { MimeType } from '../enums';
import { ThumbnailScale } from '../enums/thumbnail-scale.enum';
import { mimeColor } from '../helpers';
import { mime } from '../helpers/mime';
import { GalleryPreviewComponentInjector } from '../injectors/gallery-preview-component.injector';
import { FsGalleryConfig, FsGalleryItem, FsGalleryPersistance } from '../interfaces';

import { FsGalleryPreviewService } from './gallery-preview.service';


@Injectable()
export class FsGalleryService implements OnDestroy {

  public galleryPreviewService: FsGalleryPreviewService;
  public previewTemplate: TemplateRef<any>;
  public thumbnailPreviewTemplate: TemplateRef<any>;
  public emptyStateTemplate: TemplateRef<any>;
  public thumbnailTemplate: TemplateRef<any>;
  public previewDetails: FsGalleryPreviewDetailsDirective;
  public imageZoom = 0;
  public reorderEnabled = false;
  public imageZoomInteger = 0;
  public reorderStart$: Observable<any>;
  public reorderEnd$: Observable<any>;
  public listConfig: FsListConfig;
  public filterConfig: FilterConfig;
  public navItems: FsGalleryItem[] = [];
  public emptyStateEnabled = false;

  private _fetch$ = new Subject<void>();
  private _activeFilters$ = new BehaviorSubject(0);
  private _filterQuery = {};
  private _data$ = new BehaviorSubject<FsGalleryItem[]>([]);
  private _imageWidth: number = null;
  private _imageHeight: number = null;
  private _config: GalleryConfig = new GalleryConfig({});
  private _filter: FilterComponent;
  private _lister: FsListComponent;

  private _configUpdated$ = new Subject<void>();
  private _destroy$ = new Subject<void>();
  private _filtersReady$ = new Subject<void>();

  constructor(
    @Inject(GalleryPreviewComponentInjector) private _galleryPreviewComponent,
    private _overlay: Overlay,
    private _injector: Injector,
    private _location: Location,
    private _persistanceController: PersistanceController,
  ) {
    this.galleryPreviewService = new FsGalleryPreviewService(
      this._overlay,
      this._galleryPreviewComponent,
      this._injector,
      this,
    );
  }

  public filtersReady() {
    this._filtersReady$.next(null);
  }

  public get data$(): Observable<FsGalleryItem[]> {
    return this._data$.asObservable();
  }

  public set data(items: FsGalleryItem[]) {
    this._data$.next(this.mapData(items));
  }

  public get data(): FsGalleryItem[] {
    return this._data$.getValue();
  }

  public get activeFilters$() {
    return this._activeFilters$
      .pipe(
        debounceTime(200),
      );
  }

  public get config(): GalleryConfig {
    return this._config;
  }

  public set config(config: FsGalleryConfig) {
    this._config = new GalleryConfig(config);
    this._config.filterInit = this.filterInit.bind(this);
    this._config.filterChange = this.filterChange.bind(this);

    this._initListConfig();
    this._initFilterConfig();
    this._configUpdated$.next(null);

    if (this._config.persist) {
      this._restorePersistance(this._config.persist);
    }

    if (this._persistanceController.enabled) {
      this._restoreThumbnailScaleParams(this._persistanceController
        .getDataFromScope('thumbnailScale'));
    }

    this._listenFetch();
    this._listenSizeChange();
    this._listenUpload();

    if (this.config.viewModeGallery) {
      this.loadGallery();
    }
  }

  public get filter(): FilterComponent {
    return this._filter;
  }

  public setFilter(filter: FilterComponent) {
    this._filter = filter;
  }

  public setLister(lister: FsListComponent) {
    this._lister = lister;
  }

  public get imageWidth(): number {
    return this._imageWidth;
  }

  public get imageHeight(): number {
    return this._imageHeight;
  }

  public get fetch$(): Observable<void> {
    return this._fetch$.asObservable();
  }

  public ngOnDestroy(): void {
    this._configUpdated$.complete();

    this._destroy$.next(null);
    this._destroy$.complete();

    this.galleryPreviewService.destroy();
  }

  public beforeOpenPreview(item: FsGalleryItem): Observable<any> {
    return this.config.previewBeforeOpen ?
      this.config.previewBeforeOpen(item)
      : of(item);
  }

  public closePreview() {
    this.galleryPreviewService.close();
  }

  public openPreview(item: FsGalleryItem): FsGalleryPreviewRef {
    if (this.config.previewOpened) {
      this.config.previewOpened(item);
    }

    this._injector.get(HtmlClassRenderer).addClass('fs-gallery-preview-open');
    const galleryPreviewRef = this.galleryPreviewService.open(item);

    galleryPreviewRef
      .onClose
      .pipe(
        take(1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._injector.get(HtmlClassRenderer).removeClass('fs-gallery-preview-open');
        if (this.config.previewClosed) {
          this.config.previewClosed(item);
        }
      });

    return galleryPreviewRef;
  }

  public openItem(item: FsGalleryItem) {
    this.navItems.push(item);
    this.loadGallery();
  }

  public loadGallery() {
    this._fetch$.next(null);
  }

  public reload() {
    if (this._config.viewModeGallery) {
      this.loadGallery();
    } else if (this._config.viewModeList) {
      this._lister.reload();
    }
  }

  public mapData(items): FsGalleryItem[] {
    return items
      .map((item: FsGalleryItem) => {
        if (this.config.map) {
          item = {
            ...item,
            ...this.config.map(item),
          };
        }

        if (!item.mime) {
          item.mime = mime(item.name, item.url, item.extension, item.folder);
        }

        if (!item.mime.color) {
          item.mime.color = mimeColor(item.mime.extension, item.folder);
        }

        item = {
          ...item,
          guid: item.guid || guid(),
          items: this.mapData(item.items || []),
        };

        const mimeTypes = {};
        mimeTypes[MimeType.Image] = item.items
          .filter((_item) => _item.mime.type === MimeType.Image)
          .length;

        mimeTypes[MimeType.Video] = item.items
          .filter((_item) => _item.mime.type === MimeType.Video)
          .length;

        mimeTypes[MimeType.Audio] = item.items
          .filter((_item) => _item.mime.type === MimeType.Audio)
          .length;

        mimeTypes[MimeType.Application] = item.items
          .filter((_item) => _item.mime.type === MimeType.Application)
          .length;

        item.contains = {
          files: Number(Object.values(mimeTypes)
            .reduce((accum: number, value: number) => {
              return accum + value;
            }, 0)),
          folders: item.items
            .filter((_item) => _item.folder)
            .length,
          mimeTypes: {},
        };

        return item;
      });
  }

  public updateImageDims() {
    this._imageWidth = this.config.thumbnail.width + (this.imageZoom * this.config.thumbnail.width);
    this._imageHeight = this.config.thumbnail.height ?
      this.config.thumbnail.height + (this.imageZoom * this.config.thumbnail.height) :
      (this._imageWidth * this.config.thumbnail.heightScale);
  }

  public updateImageZoom(val: number) {
    this.imageZoom = val;
    this.imageZoomInteger = val;
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

  public updateItemData(galleryItem: FsGalleryItem, itemData) {
    const data = this.data
      .map((_item) => {
        if (_item.guid === galleryItem.guid) {
          galleryItem.data = itemData;

          return galleryItem;
        }

        return _item;
      });

    this._data$.next(data);
  }

  public getInfoItemName(item: FsGalleryItem) {
    let name = null;
    if (this.config.info?.name instanceof Function) {
      name = this.config.info.name(item);
    } else if(this.config.info?.name) {
      name = item.name;
    }

    return name;
  }

  private _initFilterConfig() {
    this.filterConfig = {
      items: this.config.filterConfig.items,
      init: () => {
        this.filterInit(this._filterQuery);
      },
      change: (query) => {
        this.filterChange(query);
        this.reload();
      },
      actions: this.config.filterConfig.actions,
      reload: this.config.reload ? () => {
        this.reload();
      } : null,
    };

    this.config.updateActions$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((filterActions) => {
        this.filter.updateActions(filterActions);
      });
  }

  private _initListConfig(): void {
    const rowActions = (this.config.itemActions || [])
      .filter((item) => item.click)
      .map((item) => {
        return {
          ...item,
          icon: '',
        };
      });

    this.listConfig = {
      rowActions,
      paging: false,
      selection: this.config.selection,
      emptyState: this.config.emptyState,
      status: false,
      fetch: (query) => {
        query = { ...this._filterQuery, ...query };

        return this.config.fetch(query, null)
          .pipe(
            map((items: FsGalleryItem[]) => {
              this.data = items;
              this._updateEmptyState(query, this.data);

              return {
                data: this.data,
                paging: { records: items.length },
              };
            }),
          );
      },
    };

    if (this.config.noResults !== undefined) {
      this.listConfig.noResults = this.config.noResults as FsListNoResultsConfig;
    }
  }

  private _listenFetch(): void {
    // Should wait until saved filters not loaded
    combineLatest([this.fetch$, this._filtersReady$])
      .pipe(
        map(() => {
          return this._filterQuery;
        }),
        switchMap((query) => {
          if (this._config.fetch) {
            const item = this.navItems[this.navItems.length - 1];

            return this._config.fetch(query, item);
          }

          return of([]);

        }),
        map((items: any) => this.mapData(items)),
        takeUntil(this._destroy$),
      )
      .subscribe((data: FsGalleryItem[]) => {
        this._updateEmptyState(this._filterQuery, data);

        this._data$.next(data);
      });
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
            this.updateImageZoom(-0.1);
          }
            break;

          case ThumbnailScale.Smaller: {
            this.updateImageZoom(-.5);
          }
            break;
  
          case ThumbnailScale.Large: {
            this.updateImageZoom(1.3);
          }
            break;

          case ThumbnailScale.Larger: {
            this.updateImageZoom(3);
          }
            break;

          case ThumbnailScale.None: {
            this.updateImageZoom(0);
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

  private _updateEmptyState(filterQuery: unknown, items: unknown[]): void {
    if (this.config.emptyState?.validate && this.emptyStateTemplate) {
      this.emptyStateEnabled = this.config.emptyState?.validate(filterQuery, items);
    }
  }

}
