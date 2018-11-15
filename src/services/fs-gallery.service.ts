import { Injectable, ComponentFactoryResolver } from '@angular/core';

import { indexOf } from '@firestitch/common/array';
import { guid } from '@firestitch/common/util';

import { get } from 'lodash';

import { FsGalleryDataItem, FsGalleryConfig, FsGalleryAddImage } from '../interfaces';
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
    dragName: null,
    updateImage: false,
    addImage: false,
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

    if (this.config.draggable && !this.config.dragName) {
      this.config.dragName = '' + guid();
    }
  }

  constructor() { }

  public getThumbnailImage(data: FsGalleryDataItem) {
    return get(data, this.thumbnailDirective.image, null);
  }

  public getPreviewImage(data: FsGalleryDataItem) {
    return get(data, this.previewDirective.image, null);
  }

  public getDataIndex(data: FsGalleryDataItem) {
    return indexOf(this.model, { [this.config.indexField]: data[this.config.indexField] });
  }

  public seekForClosest(event) {
    // screenX, screenY
    const x = event.x;
    const y = event.y;
    const minX = 0;
    const maxX = window.innerWidth;

    const previousRef = this.seekX(x, minX, y);
    const nextRef = this.seekX(x, maxX, y);

    return { previous: this.getIdByElement(previousRef), next: this.getIdByElement(nextRef) };
  }

  public isThumbnail(element) {
    return element.classList.contains('fs-gallery-thumbnail') ||
           element.classList.contains('fs-gallery-thumbnail-poster');
  }

  private seekX(currentX: number, goalX: number, y: number) {
    let result = null;

    for (let i = currentX; currentX > goalX ? i >= goalX : i <= goalX; currentX > goalX ? i-- : i++) {
      const elem = document.elementFromPoint(i, y);

      if (elem && this.isThumbnail(elem)) {
        result = elem;
        break;
      }
    }

    return result;
  }

  private getIdByElement(element): number {

    if (element) {
      const data = element.id.split('-');
      return parseInt(data[data.length - 1]);
    }

    return null;
  }

}
