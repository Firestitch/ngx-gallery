import { FilterConfig } from '@firestitch/filter';

import { GalleryMode } from './../enums';
import { FsGalleryThumbnailConfig } from './../interfaces/gallery-thumbnail-config.interface';
import { FsGalleryConfig, FsGalleryItem } from '../interfaces/gallery-config.interface';
import { GalleryLayout } from '../enums/gallery-layout.enum';


export class GalleryConfig {

  public allow = 'image/*';
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

  public zoom = true;
  public mode: GalleryMode = GalleryMode.Grid;

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

  constructor(data: FsGalleryConfig) {
    this._initConfig(data);
  }

  private _initConfig(data) {

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

    if (data.thumbnail) {
      this.thumbnail = { ...this.thumbnail, ...data.thumbnail };
    }

    this.info = data.info === undefined ? {} : data.info;
    this.reorderEnd = data.reorderEnd;
    this.toolbar = data.toolbar !== false;
    this.map = data.map;
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

    if (data.filters && Array.isArray(data.filters)) {
      this.filterConfig = {
        init: (query) => {
          this.filterInit(query);
        },
        change: (query) => {
          this.filterChange(query);
        },
        items: data.filters.slice(),
      }
    }
  }
}
