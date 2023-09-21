import { BehaviorSubject, Observable, Subject } from 'rxjs';

import {
  ActionMode,
  ActionType,
  FilterConfig,
  FsFilterAction,
  IFilterConfigItem,
  IFsFilterFileAction,
} from '@firestitch/filter';
import { FsListSelectionConfig } from '@firestitch/list';

import { FsGalleryListColumnDirective } from '../directives/column.directive';
import { GalleryLayout, ThumbnailScale } from '../enums';
import {
  FsGalleryConfig,
  FsGalleryConfigFetch,
  FsGalleryDetailsConfig,
  FsGalleryEmptyStateConfig,
  FsGalleryInfoConfig,
  FsGalleryItem, FsGalleryMapping, FsGalleryNoResultsConfig,
  FsGalleryPersistance,
  FsGalleryPreviewAction, FsGalleryPreviewMenu,
  FsGalleryThumbnailConfig
} from '../interfaces';
import { GalleryView } from './../enums';


export class GalleryConfig {

  public allow = 'image/*';
  public multiple: boolean;
  public showChangeSize: boolean;
  public showChangeView: boolean;
  public toolbar = true;
  public reorderable = false;
  public reorderEnd: (data: any) => {} = null;
  public reorderStart: (event?: { item?: FsGalleryItem; el?: any; source?: any, handle?: any, sibling?: any }) => boolean = null;
  public repeat = true;
  public info: FsGalleryInfoConfig = {
    icon: false,
    name: false,
    menu: null,
  };
  public layout = GalleryLayout.Grid;
  public showCarousel = true;
  public noResults: FsGalleryNoResultsConfig | boolean;
  public persist: FsGalleryPersistance = true;
  public details: FsGalleryDetailsConfig;
  public thumbnail: FsGalleryThumbnailConfig = {
    scale: ThumbnailScale.Medium,
  };

  public zoom = true;
  public mode: GalleryView = GalleryView.Gallery;
  public selection: FsListSelectionConfig;

  public filterConfig: FilterConfig;
  public filterInit = (query) => { };
  public filterChange = (query) => { };
  public previewClick: (item: FsGalleryItem) => {};
  public previewOpened: (item: FsGalleryItem) => {};
  public previewClosed: (item: FsGalleryItem) => {};
  public previewBeforeOpen: (item: FsGalleryItem) => Observable<any>;
  public zoomChanged: (value: number) => {};
  public map: (data: any) => FsGalleryMapping;
  public upload: (files: any) => Observable<any>;
  public fetch: FsGalleryConfigFetch;
  public actions: FsFilterAction[];
  public uploadAction: IFsFilterFileAction;
  public previewActions: FsGalleryPreviewAction[];
  public previewMenu: FsGalleryPreviewMenu;
  public preview: boolean;
  public reload: boolean;
  public emptyState: FsGalleryEmptyStateConfig;

  private _listColumns$ = new BehaviorSubject<FsGalleryListColumnDirective[]>([]);
  private _updateActions$ = new Subject<FsFilterAction[]>();
  private _viewMode$ = new BehaviorSubject<GalleryView>(GalleryView.Gallery);
  private _upload$ = new Subject<any>();
  private _thumbnailScale$ = new BehaviorSubject<ThumbnailScale>(ThumbnailScale.Small);

  constructor(data: FsGalleryConfig) {
    this._initConfig(data);
  }

  public get viewMode$(): Observable<GalleryView> {
    return this._viewMode$.asObservable();
  }

  public get updateActions$(): Observable<FsFilterAction[]> {
    return this._updateActions$.asObservable();
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

  public get viewMode(): GalleryView {
    return this._viewMode$.getValue();
  }

  public get thumbnailScale(): ThumbnailScale {
    return this._thumbnailScale$.getValue();
  }

  public get viewModeGallery(): boolean {
    return this.viewMode === GalleryView.Gallery;
  }

  public get viewModeList(): boolean {
    return this.viewMode === GalleryView.List;
  }

  private get _resizeActionIcon(): 'image' | 'photo_size_select_large' | 'photo_size_select_small' {
    switch (this.thumbnailScale) {
      case ThumbnailScale.Small:
        return 'photo_size_select_small';
      case ThumbnailScale.Medium:
        return 'photo_size_select_large';
      case ThumbnailScale.Large:
        return 'image';
    }
  }

  private get _viewModeActionIcon(): 'view_module' | 'view_list' {
    switch (this.viewMode) {
      case GalleryView.Gallery:
        return 'view_list';
      case GalleryView.List:
        return 'view_module';
    }
  }

  public setThumbnailScale(size: ThumbnailScale) {
    this._thumbnailScale$.next(size);
  }

  public setViewMode(mode: GalleryView) {
    this._viewMode$.next(mode);
    this.setThumbnailScale(this.thumbnailScale);
  }

  public setListColumns(columns: FsGalleryListColumnDirective[]): void {
    this._listColumns$.next(columns);
  }

  private _initConfig(data: FsGalleryConfig) {
    this.reorderable = !!data.reorderEnd;
    this.showChangeSize = data.showChangeSize ?? true;
    this.showChangeView = data.showChangeView ?? true;
    this.reload = data.reload ?? true;
    this.emptyState = data.emptyState;

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
      this.thumbnail = {
        ...this.thumbnail,
        ...data.thumbnail,
      };

      if (data.thumbnail.scale) {
        this.setThumbnailScale(data.thumbnail.scale);
      }
    }

    if (data.multiple !== undefined) {
      this.multiple = data.multiple;
    }

    if (data.details !== false) {
      this.details = {
        autoOpen: false,
        ...data.details as FsGalleryDetailsConfig,
      };
    }

    if (data.info !== false) {
      const info: any = data.info || {};
      this.info.icon = info.icon ?? true;
      this.info.name = info.name ?? true;
      this.info.menu = info.menu ?? null;
    }

    this.reorderEnd = data.reorderEnd;
    this.reorderStart = data.reorderStart;
    this.map = data.map;
    this.selection = data.selection;
    this.previewClosed = data.previewClosed;
    this.previewOpened = data.previewOpened;
    this.previewBeforeOpen = data.previewBeforeOpen;
    this.zoomChanged = data.zoomChanged;
    this.noResults = data.noResults;
    this.fetch = data.fetch;
    this.upload = data.upload;
    this.actions = data.actions;
    this.uploadAction = data.uploadAction;
    this.previewActions = data.previewActions || [];
    this.previewMenu = data.previewMenu;
    this.preview = data.preview ?? true;
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

    config.actions = this._getActionsConfig(this.actions);

    return config;
  }

  private _toggleViewMode(): void {
    if (this.viewMode === GalleryView.Gallery) {
      this.setViewMode(GalleryView.List);
    } else {
      this.setViewMode(GalleryView.Gallery);
    }
  }

  private _getActionsConfig(actions: FsFilterAction[]): FsFilterAction[] {
    actions = actions && Array.isArray(actions) ? actions : [];
    const filterActions: FsFilterAction[] = [];

    if (this.showChangeSize) {
      filterActions.push(
        {
          mode: ActionMode.Menu,
          icon: this._resizeActionIcon,
          type: ActionType.Raised,
          className: 'size',
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
      );
    }

    if (this.showChangeView) {
      filterActions.push(
        {
          mode: ActionMode.Button,
          icon: this._viewModeActionIcon,
          className: 'view-mode',
          primary: false,
          click: () => {
            this._toggleViewMode();
            this._updateActions();
          },
        });
    }

    filterActions.push(
      ...actions,
    );

    if (this.upload) {
      filterActions.push({
        mode: ActionMode.File,
        label: 'Upload',
        className: 'fs-gallery-upload-btn',
        color: 'primary',
        select: (file) => {
          this.upload(file)
            .subscribe(() => {
              this._upload$.next();
            });
        },
        accept: this.allow,
        multiple: this.multiple,
        ...this.uploadAction,
      });
    }

    return filterActions;
  }

  private _updateActions(): void {
    this._updateActions$.next(this._getActionsConfig(this.actions));
  }

}
