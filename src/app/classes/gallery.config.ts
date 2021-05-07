import { BehaviorSubject, Observable } from 'rxjs';

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
import { FsGalleryConfig, FsGalleryItem } from '../interfaces/gallery-config.interface';
import { GalleryLayout } from '../enums/gallery-layout.enum';
import { ViewSize } from '../enums/view-size.enum';
import { FsGalleryPersistance } from '../interfaces/gallery-persist-config.interface';


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
  public thumbnail: FsGalleryThumbnailConfig = {
    styles: {},
    width: 187,
    heightScale: 0.673,
  };
  public persist: FsGalleryPersistance = true;

  public zoom = true;
  public mode: GalleryMode = GalleryMode.Grid;
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

  public upload: (files: any) => void;
  public fetch;

  private _viewMode$ = new BehaviorSubject<'gallery' | 'list'>('gallery');
  private _sizeMode$ = new BehaviorSubject<ViewSize>(ViewSize.Small);

  private _listRef: FsListComponent;

  constructor(data: FsGalleryConfig) {
    this._initConfig(data);
  }

  public get viewMode$(): Observable<'gallery' | 'list'> {
    return this._viewMode$.asObservable();
  }

  public get sizeMode$(): Observable<ViewSize> {
    return this._sizeMode$.asObservable();
  }

  public get viewMode(): 'gallery' | 'list' {
    return this._viewMode$.getValue();
  }

  public get sizeMode(): ViewSize {
    return this._sizeMode$.getValue();
  }

  public get galleryViewMode(): boolean {
    return this.viewMode === 'gallery';
  }

  public get listViewMode(): boolean {
    return this.viewMode === 'list';
  }

  public get listRef(): FsListComponent {
    return this._listRef;
  }

  private get _resizeActionIcon(): 'image' | 'photo_size_select_large' | 'photo_size_select_small' {
    switch (this.sizeMode) {
      case ViewSize.Small: return 'photo_size_select_small';
      case ViewSize.Medium: return 'photo_size_select_large';
      case ViewSize.Large: return 'image';
    }
  }

  private get _viewModeActionIcon(): 'view_module' | 'view_list' {
    switch (this.viewMode) {
      case 'gallery': return 'view_list';
      case 'list': return 'view_module';
    }
  }

  public setListRef(ref: FsListComponent) {
    this._listRef = ref;
  }

  public setViewSize(size: ViewSize) {
    this._sizeMode$.next(size);
  }

  public setViewMode(mode: 'gallery' | 'list') {
    this._viewMode$.next(mode);
    this.setViewSize(this.sizeMode);
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

    if (data.sizeModeDefault) {
      this.setViewSize(data.sizeModeDefault);
    }

    if (data.persist !== undefined) {
      this.persist = data.persist;
    }

    if (data.thumbnail) {
      this.thumbnail = { ...this.thumbnail, ...data.thumbnail };
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

    if (this.upload) {
      config.actions = this._getActionsConfig();
    }

    return config;
  }

  private _toggleViewMode(): void {
    if (this.viewMode === 'gallery') {
      this.setViewMode('list');
    } else {
      this.setViewMode('gallery');
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
              this.setViewSize(ViewSize.Large);
              this._updateActions();
            },
          },
          {
            label: 'Medium',
            icon: 'photo_size_select_large',
            click: () => {
              this.setViewSize(ViewSize.Medium);
              this._updateActions();
            },
          },
          {
            label: 'Small',
            icon: 'photo_size_select_small',
            click: () => {
              this.setViewSize(ViewSize.Small);
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
          this.upload(file);
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
