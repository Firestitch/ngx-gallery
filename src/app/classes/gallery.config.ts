
import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';
import {
  ActionMode,
  FilterConfig,
  FsFilterAction,
  IFilterConfigItem,
} from '@firestitch/filter';
import { FsListSelectionConfig } from '@firestitch/list';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FsGalleryListColumnDirective } from '../directives/column.directive';
import { GalleryLayout, ThumbnailScale } from '../enums';
import {
  FsGalleryConfig,
  FsGalleryConfigFetch,
  FsGalleryDetailsConfig,
  FsGalleryEmptyStateConfig,
  FsGalleryInfoConfig,
  FsGalleryItem, FsGalleryItemAction, FsGalleryMapping, FsGalleryNoResultsConfig,
  FsGalleryPersistance,
  FsGalleryThumbnailConfig,
  FsGalleryUploadConfig,
} from '../interfaces';

import { GalleryView } from './../enums';


export class GalleryConfig {

  public uploadAccept: string;
  public uploadMultiple: boolean;
  public showChangeSize: boolean;
  public showChangeView: boolean;
  public toolbar = true;
  public reorderable = false;
  public reorderEnabled = false;
  public reorderEnd: (data: any) => void;
  public reorderStart: (event?: { item?: FsGalleryItem; el?: HTMLElement; source?: any }) => boolean;
  public info: FsGalleryInfoConfig = {
    icon: false,
    name: false,
  };
  public layout = GalleryLayout.Grid;
  public showCarousel = true;
  public noResults: FsGalleryNoResultsConfig | boolean;
  public persist: FsGalleryPersistance = false;
  public details: FsGalleryDetailsConfig;
  public thumbnail: FsGalleryThumbnailConfig = {
    scale: ThumbnailScale.None,
  };
  public zoom = true;
  public mode: GalleryView = GalleryView.Gallery;
  public selection: FsListSelectionConfig;
  public filterConfig: FilterConfig;
  public filterInit: (query: any) => void;
  public filterChange: (query: any) => void;
  public previewClick: (item: FsGalleryItem) => void;
  public previewOpened: (item: FsGalleryItem) => void;
  public previewClosed: (item: FsGalleryItem) => void;
  public zoomChanged: (value: number) => void;
  public previewBeforeOpen: (item: FsGalleryItem) => Observable<any>;
  public map: (data: any) => FsGalleryMapping;
  public upload: FsGalleryUploadConfig;
  public fetch: FsGalleryConfigFetch;
  public actions: FsFilterAction[];
  public itemActions: FsGalleryItemAction[];
  public preview: boolean;
  public reload: boolean;
  public emptyState: FsGalleryEmptyStateConfig;

  private _listColumns$ = new BehaviorSubject<FsGalleryListColumnDirective[]>([]);
  private _updateActions$ = new Subject<FsFilterAction[]>();
  private _viewMode$ = new BehaviorSubject<GalleryView>(GalleryView.Gallery);
  private _upload$ = new Subject<any>();
  private _thumbnailScale$ = new BehaviorSubject<ThumbnailScale>(ThumbnailScale.None);

  constructor(config: FsGalleryConfig) {
    this._initConfig(config);
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

  private get _resizeActionIcon() {
    switch (this.thumbnailScale) {
      case ThumbnailScale.Small:
        return 'photo_size_select_small';
      case ThumbnailScale.Smaller:
        return 'photo_size_select_small';
      case ThumbnailScale.Larger:
        return 'photo_size_select_large';
      case ThumbnailScale.Large:
        return 'image';
      default:
        return 'crop_original';
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
  
  // eslint-disable-next-line complexity, max-statements
  private _initConfig(config: FsGalleryConfig) {
    this._thumbnailScale$.next(this.thumbnail.scale);
    this.showChangeSize = config.showChangeSize ?? true;
    this.showChangeView = config.showChangeView ?? true;
    this.reload = config.reload ?? true;
    this.emptyState = config.emptyState;
    this.uploadAccept = config.upload?.accept ?? '';
    this.uploadMultiple = config.upload?.multiple ?? true;

    if (config.layout) {
      this.layout = config.layout;
    }

    this.showCarousel = (config.showCarousel !== undefined) ? config.showCarousel : true;

    if (config.zoom !== undefined) {
      this.zoom = config.zoom;
    }

    if (this.showChangeSize) {
      this.persist = config.persist ?? true;
    }

    if (config.thumbnail) {
      this.thumbnail = {
        ...this.thumbnail,
        ...config.thumbnail,
      };

      if (config.thumbnail.scale) {
        this.setThumbnailScale(config.thumbnail.scale);
      }
    }

    if (config.details !== false) {
      this.details = {
        autoOpen: false,
        ...config.details as FsGalleryDetailsConfig,
      };
    }

    if (config.info !== false) {
      const info: any = config.info || {};
      this.info.icon = info.icon ?? true;
      this.info.name = info.name ?? true;
    }

    this.map = config.map;
    this.selection = config.selection;
    this.previewClosed = config.previewClosed;
    this.previewClick = config.previewClick;
    this.previewOpened = config.previewOpened;
    this.previewBeforeOpen = config.previewBeforeOpen;
    this.zoomChanged = config.zoomChanged;
    this.noResults = config.noResults;
    this.fetch = config.fetch;
    this.upload = config.upload;
    this.actions = config.actions;
    this.preview = config.preview ?? true;
    this.filterConfig = this._getFilterConfig(config.filters);
    this._initItemActions(config.itemActions);
    this._initReorder(config);
  }

  private _initReorder(config: FsGalleryConfig) {
    this.reorderable = !!config.reorder;
    if(this.reorderable) {
      this.reorderEnabled = config.reorder?.enabled ?? true;
    }

    this.reorderEnd = config.reorder?.end || (() => {
      // DO NOTHING
    });

    this.reorderStart = config.reorder?.start || (() => {
      return false;
    });
  }

  private _initItemActions(actions: FsGalleryItemAction[]) {
    this.itemActions = (actions || [])
      .map((action: FsGalleryItemAction) => {
        if (action.download) {
          action = {
            ...action,
            click: (item: FsGalleryItem) => {
              if (item.url instanceof FsApiFile) {
                item.url.download();
              } else if (item.url instanceof File) {
                (new FsFile(item.url))
                  .download();
              } else if (item.url instanceof FsFile) {
                item.url.download();
              } else {
                const url = new URL(item.url);
                const link = document.createElement('a');
                link.href = item.url;
                link.download = url.pathname.split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            },
          };
        }

        return action;
      });
  }

  private _getFilterConfig(items: IFilterConfigItem[]): FilterConfig {
    items = items && Array.isArray(items) ? items : [];

    const config: FilterConfig = {
      init: (query) => {
        if(this.filterInit) {
          this.filterInit(query);
        }
      },
      change: (query) => {
        if(this.filterChange) {
          this.filterChange(query);
        }
      },
      items: [...items],
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
          className: 'size',
          show: () => this.viewModeGallery,
          primary: false,
          items: [
            {
              label: 'Larger',
              icon: 'image',
              click: () => {
                this.setThumbnailScale(ThumbnailScale.Larger);
                this._updateActions();
              },
            },
            {
              label: 'Large',
              icon: 'photo_size_select_large',
              click: () => {
                this.setThumbnailScale(ThumbnailScale.Large);
                this._updateActions();
              },
            },
            {
              label: 'Original',
              icon: 'crop_original',
              click: () => {
                this.setThumbnailScale(ThumbnailScale.None);
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
            {
              label: 'Smaller',
              icon: 'photo_size_select_small',
              click: () => {
                this.setThumbnailScale(ThumbnailScale.Smaller);
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
        accept: this.uploadAccept,
        multiple: this.uploadMultiple,
        ...this.upload,
        select: (file) => {
          this.upload.select(file)
            .subscribe(() => {
              this._upload$.next(null);
            });
        },
      });
    }

    return filterActions;
  }

  private _updateActions(): void {
    this._updateActions$.next(this._getActionsConfig(this.actions));
  }

}
