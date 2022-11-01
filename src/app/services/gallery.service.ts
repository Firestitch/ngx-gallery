import { Inject, Injectable, Injector, OnDestroy, TemplateRef } from '@angular/core';

import { Overlay } from '@angular/cdk/overlay';
import { Location } from '@angular/common';

import { guid, getNormalizedPath } from '@firestitch/common';
import { FilterComponent, FilterConfig } from '@firestitch/filter';
import { FsListConfig, FsListNoResultsConfig, ReorderStrategy } from '@firestitch/list';

import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { round } from 'lodash-es';
import { DragulaService } from 'ng2-dragula';

import { GalleryConfig } from '../classes/gallery.config';
import { FsGalleryItem, FsGalleryPersistance } from '../interfaces';
import { FsGalleryPreviewService } from './gallery-preview.service';
import { MimeType } from '../enums';
import { mime } from '../helpers/mime';
import { PersistanceController } from '../classes/persistance-controller';
import { ThumbnailScale } from '../enums/thumbnail-scale.enum';
import { FsGalleryListColumnDirective } from '../directives/column.directive';
import { mimeColor } from '../helpers';
import { GalleryPreviewComponentInjector } from '../injectors/gallery-preview-component.injector';


@Injectable()
export class FsGalleryService implements OnDestroy {

  public dragName = 'fs-gallery-dragular';
  public galleryPreviewService: FsGalleryPreviewService;
  public previewTemplate: TemplateRef<any>;
  public thumbnailPreviewTemplate: TemplateRef<any>;
  public thumbnailTemplate: TemplateRef<any>;
  public detailsTemplate: TemplateRef<any>;
  public imageZoom = 0;
  public imageZoomInteger = 0;
  public dimentionsChange$ = new Subject<void>();
  public reorderStart$: Observable<any>;
  public reorderEnd$: Observable<any>;
  public listConfig: FsListConfig;
  public filterConfig: FilterConfig;
  public navItems: FsGalleryItem[] = [];
  public previewComponent;
  public filtersReady$ = new Subject<void>();

  private _fetch$ = new Subject<void>();
  private _activeFilters$ = new BehaviorSubject(0);
  private _filterQuery = {};
  private _data$ = new BehaviorSubject<FsGalleryItem[]>([]);
  private _imageWidth: number = null;
  private _imageHeight: number = null;
  private _config: GalleryConfig = new GalleryConfig({});
  private _filter: FilterComponent;

  private _configUpdated$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(GalleryPreviewComponentInjector) private _galleryPreviewComponent,
    private _overlay: Overlay,
    private _injector: Injector,
    private _location: Location,
    private _dragulaService: DragulaService,
    private _persistanceController: PersistanceController,
  ) {
    this.dragName += guid();
    this.galleryPreviewService = new FsGalleryPreviewService(_overlay, this._galleryPreviewComponent, _injector);
    this.reorderStart$ = this._dragulaService.drag(this.dragName);
    this.reorderEnd$ = this._dragulaService.dragend(this.dragName);
  }

  public get data$() {
    return this._data$;
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

  public get filter(): FilterComponent {
    return this._filter;
  }

  public setFilter(filter: FilterComponent) {
    this._filter = filter;
  }

  public set config(value: GalleryConfig) {
    this._config = value || new GalleryConfig({});
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

    this._listenFetch();
    this._listenSizeChange();
    this._listenUpload();

    if (this.config.viewModeGallery) {
      this.loadGallery();
    }


    if (this.config.reorderStart) {
      this._dragulaService.createGroup(this.dragName, {
        moves: (el, source, handle, sibling) => {
          const group = this._dragulaService.find(this.dragName);
          const index = Array.from(source.childNodes).indexOf(el);
          const item: FsGalleryItem = group.drake.models[0][index];

          return this.config.reorderStart({ item, el, source, handle, sibling });
        }
      });
    }
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

    this._destroy$.next();
    this._destroy$.complete();

    this.galleryPreviewService.destroy();
  }

  public beforeOpenPreview(item: FsGalleryItem): Observable<any> {
    return this.config.previewBeforeOpen ?
      this.config.previewBeforeOpen(item)
      : of(item);
  }

  public closePreview() {
    this.galleryPreviewService.close()
  }

  public openPreview(item: FsGalleryItem) {
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

  public openItem(item: FsGalleryItem) {
    this.navItems.push(item);
    this.loadGallery();
  }

  public loadGallery() {
    this._fetch$.next();
  }

  public reload() {
    if (this._config.viewModeGallery) {
      this.loadGallery();
    } else if (this._config.viewModeList) {
      this.filter.reload();
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
          items: this.mapData(item.items || []),
        };

        const mimeTypes = {};
        mimeTypes[MimeType.Image] = item.items
          .filter((item) => item.mime.type === MimeType.Image)
          .length;

        mimeTypes[MimeType.Video] = item.items
          .filter((item) => item.mime.type === MimeType.Video)
          .length;

        mimeTypes[MimeType.Audio] = item.items
          .filter((item) => item.mime.type === MimeType.Audio)
          .length;

        mimeTypes[MimeType.Application] = item.items
          .filter((item) => item.mime.type === MimeType.Application)
          .length;

        item.contains = {
          files: Number(Object.values(mimeTypes)
            .reduce((accum: number, value: number) => { return accum + value }, 0)),
          folders: item.items
            .filter((item) => item.folder)
            .length,
          mimeTypes: {},
        }

        return item;
      });
  }

  public updateImageDims() {
    this._imageWidth = this.config.thumbnail.width + (this.imageZoom * this.config.thumbnail.width);

    if (this.config.thumbnail.height) {
      this._imageHeight = this.config.thumbnail.height + (this.imageZoom * this.config.thumbnail.height);
    } else {
      this._imageHeight = (this._imageWidth * this.config.thumbnail.heightScale);
    }

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

  public getInfoMenuItemActions(item: FsGalleryItem) {
    if (this.config.info.menu) {
      return this.config.info.menu.actions
        .filter((action) => {
          return !action.show || action.show(item);
        })
        .map((action) => {
          const label = action.label instanceof Function ?
            action.label(item) : action.label;

          return {
            ...action,
            label,
          };
        });
    }

    return [];
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

    this.config.updateActions$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((filterActions) => {
        this.filter.updateActions(filterActions);
      });
  }

  private _initListConfig(): void {
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
        return this.config.fetch(query, null)
          .pipe(
            map((items: any) => this.mapData(items)),
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

  private _listenFetch(): void {
    // Should wait until saved filters not loaded
    combineLatest([this.fetch$, this.filtersReady$])
      .pipe(
        map(() => {
          const query = {
            ...this._filterQuery,
          };

          return query;
        }),
        switchMap((query) => {
          if (this._config.fetch) {
            const item = this.navItems[this.navItems.length - 1];

            return this._config.fetch(query, item)
          } else {
            return of([]);
          }
        }),
        map((items: any) => this.mapData(items)),
        takeUntil(this._destroy$),
      )
      .subscribe((data: FsGalleryItem[]) => {
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
