import { guid } from '@firestitch/common';

import { FsGalleryConfig } from '../interfaces/gallery-config.interface';


export class GalleryConfig {
  public indexField = 'id';
  public draggable = true;
  public dragName = null;
  public repeat = true;
  public showCarousel = true;
  public overwriteThumbnailTemplate: false;
  public thumbnail = {
    styles: {}
  };

  public zoom = true;

  public filterConfig;
  public filterInit = (query) => {};
  public filterChange = (query) => {};

  public upload: (files: any) => void;
  public fetch;
  
  constructor(data: FsGalleryConfig = {}) {
    this._initConfig(data);
  }

  private _initConfig(data) {
    this.indexField = data.indexField || this.indexField;

    if (data.draggable !== undefined) {
      this.draggable = data.draggable;
    }
    this.dragName = data.dragName;

    if (!this.dragName) {
      this.dragName = '' + guid();
    }

    this.repeat = (data.repeat !== undefined) ? data.repeat : true;
    this.showCarousel = (data.showCarousel !== undefined) ? data.showCarousel : true;
    this.overwriteThumbnailTemplate = data.overwriteThumbnailTemplate;

    if (data.zoom !== undefined) {
      this.zoom = data.zoom;
    }

    if (data.thumbnail) {
      this.thumbnail = Object.assign({}, this.thumbnail, data.thumbnail);
    }

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
