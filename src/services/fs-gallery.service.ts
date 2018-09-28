import { Injectable } from '@angular/core';

import { indexOf } from '@firestitch/common/array';

import { get } from 'lodash';

import { FsGalleryDataItem, FsGalleryConfig } from '../interfaces';
import { FsGalleryPreviewDirective, FsGalleryThumbnailDirective } from '../directives';


@Injectable()
export class FsGalleryService {

  public previewTemplate: FsGalleryPreviewDirective = null;
  public thumbnailTemplate: FsGalleryThumbnailDirective = null;
  public previewDirective: FsGalleryPreviewDirective = null;
  public thumbnailDirective: FsGalleryThumbnailDirective = null;

  private _model: FsGalleryDataItem[] = [];

  get model(): FsGalleryDataItem[] {
    return this._model;
  }

  set model(value: FsGalleryDataItem[]) {
    value = value || [];
    this._model = value;
  }

  private _defaultConfig: FsGalleryConfig = {
    indexField: 'id',
    draggable: false,
    repeat: true,
    thumbnail: {
      styles: {}
    }
  };

  private _config: FsGalleryConfig = null;

  get config(): FsGalleryConfig {
    return this._config;
  }

  set config(value: FsGalleryConfig) {
    this._config = Object.assign(this._defaultConfig, value);
  }

  constructor() { }

  getThumbnailImage(data: FsGalleryDataItem) {
    return get(data, this.thumbnailDirective.image, null);
  }

  getPreviewImage(data: FsGalleryDataItem) {
    return get(data, this.previewDirective.image, null);
  }

  getDataIndex(data: FsGalleryDataItem) {
    return indexOf(this.model, { [this.config.indexField]: data[this.config.indexField] });
  }

}
