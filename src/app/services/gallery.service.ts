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
  PaginationStrategy,
} from '@firestitch/list';

import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';


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
import { FsGalleryConfig, FsGalleryFetchResult, FsGalleryItem, FsGalleryPersistance } from '../interfaces';

import { FsGalleryPreviewService } from './gallery-preview.service';


/** What a fetch of the gallery view is for: the first page, the next one, or the ones already shown, again. */
enum GalleryFetch {
  First = 'first',
  More = 'more',
  Reload = 'reload',
}


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

  private _fetch$ = new Subject<GalleryFetch>();
  private _filterQuery = {};
  private _data$ = new BehaviorSubject<FsGalleryItem[]>([]);
  private _hasMore$ = new BehaviorSubject<boolean>(false);
  private _loadingMore$ = new BehaviorSubject<boolean>(false);
  private _imageWidth: number = null;
  private _imageHeight: number = null;
  private _config: GalleryConfig = new GalleryConfig({});
  private _filter: FilterComponent;
  private _lister: FsListComponent;

  private _configUpdated$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

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

  public get data$(): Observable<FsGalleryItem[]> {
    return this._data$.asObservable();
  }

  public set data(items: FsGalleryItem[]) {
    this._data$.next(this.mapData(items));
  }

  public get data(): FsGalleryItem[] {
    return this._data$.getValue();
  }

  public get config(): GalleryConfig {
    return this._config;
  }

  public set config(config: FsGalleryConfig) {
    this._config = new GalleryConfig(config);

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
    return this._fetch$
      .pipe(
        map(() => undefined),
      );
  }

  /** Whether the gallery view has more to load: Load More shows while it does. */
  public get hasMore$(): Observable<boolean> {
    return this._hasMore$.asObservable();
  }

  public get loadingMore$(): Observable<boolean> {
    return this._loadingMore$.asObservable();
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

  /** The gallery view from its first page. */
  public loadGallery() {
    this._fetch$.next(GalleryFetch.First);
  }

  /** The gallery view's next page, after the ones shown. */
  public loadMore() {
    this._fetch$.next(GalleryFetch.More);
  }

  /** What is shown, again: every page already loaded, so the view stays where it is. */
  public reload() {
    if (this._config.viewModeGallery) {
      this._fetch$.next(GalleryFetch.Reload);
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
      ...(this.config.filterConfig || {}),
      items: this.config.filterConfig.items,
      init: (query?: any) => {
        this._filterQuery = query;
        this._load();
      },
      change: (query?: any) => {
        this._filterQuery = query;
        this._load();
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

    const loadMore = this.config.loadMore;

    this.listConfig = {
      rowActions,
      // With Load More the list pages as the gallery view does, by offset, under the list's own button
      paging: loadMore ? { limit: loadMore.limit, strategy: PaginationStrategy.Offset } : false,
      loadMore: loadMore ?? false,
      selection: this.config.selection,
      emptyState: this.config.emptyState,
      status: false,
      fetch: (query) => {
        query = { ...this._filterQuery, ...query };

        return this.config.fetch(query, null)
          .pipe(
            map((response) => {
              const result = this._getFetchResult(response);
              const items = this.mapData(result.data);

              this._data$.next(query.offset ? [...this.data, ...items] : items);
              this._updateEmptyState(query, this.data);

              return {
                data: items,
                paging: { records: this._getRecords(query, result) },
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
    this._fetch$
      .pipe(
        tap((fetch) => this._loadingMore$.next(fetch === GalleryFetch.More)),
        switchMap((fetch) => {
          const query = { ...this._filterQuery, ...this._getPagingQuery(fetch) };

          return this._fetchItems(query)
            .pipe(
              map((result) => ({ fetch, query, result })),
            );
        }),
        tap(({ fetch, query, result }) => {
          const items = this.mapData(result.data);
          const data = fetch === GalleryFetch.More ? [...this.data, ...items] : items;

          this._hasMore$.next(!!this.config.loadMore && data.length < this._getRecords(query, result));
          this._loadingMore$.next(false);
          this._updateEmptyState(this._filterQuery, data);
          this._data$.next(data);
        }),
        takeUntil(this._configUpdated$),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  /**
   * The page a gallery view's fetch asks for: none without Load More, which answers everything at once; with it,
   * the first page, the one after those shown, or as many as are shown, so a reload keeps the view where it is.
   */
  private _getPagingQuery(fetch: GalleryFetch): { limit?: number; offset?: number } {
    const loadMore = this.config.loadMore;
    if (!loadMore) {
      return {};
    }

    switch (fetch) {
      case GalleryFetch.More:
        return { limit: loadMore.limit, offset: this.data.length };

      case GalleryFetch.Reload:
        return { limit: Math.max(loadMore.limit, this.data.length), offset: 0 };

      default:
        return { limit: loadMore.limit, offset: 0 };
    }
  }

  private _fetchItems(query: Record<string, unknown>): Observable<{ data: FsGalleryItem[]; records: number | null }> {
    if (!this._config.fetch) {
      return of({ data: [], records: 0 });
    }

    const item = this.navItems[this.navItems.length - 1];

    return this._config.fetch(query, item)
      .pipe(
        map((response) => this._getFetchResult(response)),
      );
  }

  /** A fetch's answer in one shape: its items, and how many the query matches in all when it says. */
  private _getFetchResult(response: FsGalleryItem[] | FsGalleryFetchResult): { data: FsGalleryItem[]; records: number | null } {
    return Array.isArray(response)
      ? { data: response, records: null }
      : { data: response?.data || [], records: response?.paging?.records ?? null };
  }

  /**
   * How many the query matches in all: what the fetch said or, when it did not, the ones up to the end of this
   * page, and one more when the page came back full, so Load More shows until a page comes back short.
   */
  private _getRecords(query: { offset?: number; limit?: number }, result: { data: FsGalleryItem[]; records: number | null }): number {
    if (result.records !== null) {
      return result.records;
    }

    const loaded = (query.offset || 0) + result.data.length;

    return this.config.loadMore && result.data.length >= query.limit ? loaded + 1 : loaded;
  }

  /** A new query: the gallery view from its first page, and the list from what its own paging says. */
  private _load(): void {
    if (this._config.viewModeGallery) {
      this.loadGallery();
    } else if (this._config.viewModeList) {
      this._lister.reload();
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
