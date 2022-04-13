import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FsListComponent, FsListSelectionConfig } from '@firestitch/list';
import {
  ActionMode,
  ActionType,
  FilterConfig,
  FsFilterAction,
  IFilterConfigItem,
} from '@firestitch/filter';

import { GalleryMode } from './../enums';
import { FsGalleryThumbnailConfig } from './../interfaces/gallery-thumbnail-config.interface';
import { FsGalleryConfig, FsGalleryItem, FsGalleryNoResultsConfig } from '../interfaces/gallery-config.interface';
import { GalleryLayout } from '../enums/gallery-layout.enum';
import { ThumbnailScale } from '../enums/thumbnail-scale.enum';
import { FsGalleryPersistance } from '../interfaces/gallery-persist-config.interface';
import { FsGalleryListColumnDirective } from '../directives/column/column.directive';


export class GalleryConfig {

  public allow = 'image/*';
  public multiple: boolean;
  public toolbar = true;
  public reorderable = false;
  public reorderEnd: (data: any) => {} = null;
  public repeat = true;
  public info: any;
  public layout = GalleryLayout.Grid;
  public showCarousel = true;
  public noResults: FsGalleryNoResultsConfig | false;
  public persist: FsGalleryPersistance = true;
  public thumbnail: FsGalleryThumbnailConfig = {
    styles: {},
    width: 187,
    heightScale: 0.673,
    scale: ThumbnailScale.Medium,
  };

  public zoom = true;
  public mode: GalleryMode = GalleryMode.Gallery;
  public selection: FsListSelectionConfig;

  public filterConfig: FilterConfig;
  public filterInit = (query) => {};
  public filterChange = (query) => {};
  public previewClick: (item: FsGalleryItem) => {};
  public previewOpened: (item: FsGalleryItem) => {};
  public previewClosed: (item: FsGalleryItem) => {};
  public previewBeforeOpen: (item: FsGalleryItem) => {};
  public zoomChanged: (value: number) => {};
  public map: (data: any) => {};

  public upload: (files: any) => Observable<any>;
  public fetch;

  private _listColumns$ = new BehaviorSubject<FsGalleryListColumnDirective[]>([]);
  private _viewMode$ = new BehaviorSubject<GalleryMode>(GalleryMode.Gallery);
  private _upload$ = new Subject<any>();
  private _thumbnailScale$ = new BehaviorSubject<ThumbnailScale>(ThumbnailScale.Small);

  private _listRef: FsListComponent;

  constructor(data: FsGalleryConfig) {
    this._initConfig(data);
  }

  public get viewMode$(): Observable<GalleryMode> {
    return this._viewMode$.asObservable();
  }

  public get upload$(): Observable<any> {
    return this._upload$.asObservable();
  }

  public get thumbnailScale$(): Observable<ThumbnailScale> {
    return this._thumbnailScale$.asObservable();
  }

  public get listColumns$(): Observable<FsGalleryListColumnDirective[]> {
    return this._listColumns$;
  }

  public get viewMode(): GalleryMode {
    return this._viewMode$.getValue();
  }

  public get thumbnailScale(): ThumbnailScale {
    return this._thumbnailScale$.getValue();
  }

  public get viewModeGallery(): boolean {
    return this.viewMode === GalleryMode.Gallery;
  }

  public get viewModeList(): boolean {
    return this.viewMode === GalleryMode.List;
  }

  public get listRef(): FsListComponent {
    return this._listRef;
  }

  private get _resizeActionIcon(): 'image' | 'photo_size_select_large' | 'photo_size_select_small' {
    switch (this.thumbnailScale) {
      case ThumbnailScale.Small: return 'photo_size_select_small';
      case ThumbnailScale.Medium: return 'photo_size_select_large';
      case ThumbnailScale.Large: return 'image';
    }
  }

  private get _viewModeActionIcon(): 'view_module' | 'view_list' {
    switch (this.viewMode) {
      case GalleryMode.Gallery: return 'view_list';
      case GalleryMode.List: return 'view_module';
    }
  }

  public setListRef(ref: FsListComponent) {
    this._listRef = ref;
  }

  public reload(): void {
    if (this._listRef?.filterRef) {
      this._listRef.reload();
    }
  }

  public setThumbnailScale(size: ThumbnailScale) {
    this._thumbnailScale$.next(size);
  }

  public setViewMode(mode: GalleryMode) {
    this._viewMode$.next(mode);
    this.setThumbnailScale(this.thumbnailScale);
  }

  public setListColumns(columns: FsGalleryListColumnDirective[]): void {
    this._listColumns$.next(columns);
  }

  private _initConfig(data: FsGalleryConfig) {

    this.reorderable = !!data.reorderEnd;

    if (data.layout) {
      this.layout = data.layout;
    }

    this.repeat = (data.repeat !== undefined) ? data.repeat : true;
    this.showCarousel = (data.showCarousel !== undefined) ? data.showCarousel : true;

    if (data.zoom !== undefined) {
      this.zoom = data.zoom;
    }

    if (data.allow) {
      this.allow = data.allow;
    }

    if (data.persist !== undefined) {
      this.persist = data.persist;
    }

    if (data.thumbnail) {
      this.thumbnail = { ...this.thumbnail, ...data.thumbnail };

      if (data.thumbnail.scale) {
        this.setThumbnailScale(data.thumbnail.scale);
      }
    }

    if (data.multiple !== undefined) {
      this.multiple = data.multiple;
    }

    this.info = data.info === undefined ? {} : data.info;
    this.reorderEnd = data.reorderEnd;
    this.toolbar = data.toolbar !== false;
    this.map = data.map;
    this.selection = data.selection;
    this.previewClosed = data.previewClosed;
    this.previewOpened = data.previewOpened;
    this.previewBeforeOpen = data.previewBeforeOpen;
    this.zoomChanged = data.zoomChanged;
    this.noResults = data.noResults;

    if (data.upload) {
      this.upload = data.upload;
    }

    if (data.fetch) {
      this.fetch = data.fetch;
    }

    this.filterConfig = this._getFilterConfig(data.filters);
  }

  private _getFilterConfig(items: IFilterConfigItem[]): FilterConfig {
    items = items && Array.isArray(items) ? items : [];

    const config: FilterConfig = {
      init: (query) => {
        this.filterInit(query);
      },
      change: (query) => {
        this.filterChange(query);
      },
      items: items.slice(),
    };

    config.actions = this._getActionsConfig();

    return config;
  }

  private _toggleViewMode(): void {
    if (this.viewMode === GalleryMode.Gallery) {
      this.setViewMode(GalleryMode.List);
    } else {
      this.setViewMode(GalleryMode.Gallery);
    }
  }

  private _getActionsConfig(): FsFilterAction[] {
    return [
      {
        mode: ActionMode.Menu,
        icon: this._resizeActionIcon,
        type: ActionType.Raised,
        primary: false,
        items: [
          {
            label: 'Large',
            icon: 'image',
            click: () => {
              this.setThumbnailScale(ThumbnailScale.Large);
              this._updateActions();
            },
          },
          {
            label: 'Medium',
            icon: 'photo_size_select_large',
            click: () => {
              this.setThumbnailScale(ThumbnailScale.Medium);
              this._updateActions();
            },
          },
          {
            label: 'Small',
            icon: 'photo_size_select_small',
            click: () => {
              this.setThumbnailScale(ThumbnailScale.Small);
              this._updateActions();
            },
          },
        ],
      },
      {
        mode: ActionMode.Button,
        icon: this._viewModeActionIcon,
        primary: false,
        click: () => {
          this._toggleViewMode();
          this._updateActions();
        },
      },
      {
        mode: ActionMode.File,
        label: 'Upload',
        color: 'primary',
        select: (file) => {
          this.upload(file)
          .subscribe(() => {
            this._upload$.next();
          });
        },
        show: () => {
          return !!this.upload;
        },
        accept: this.allow,
        multiple: this.multiple,
      }
    ];
  }

  private _updateActions(): void {
    if (!this._listRef?.filterRef) { return }

    this._listRef.filterRef.updateActions(this._getActionsConfig());
  }

}
