import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FsGalleryDataItem } from '../interfaces';


@Injectable()
export class FsGalleryPreviewService {

  private _data: BehaviorSubject<FsGalleryDataItem> = new BehaviorSubject<FsGalleryDataItem>(null);

  public data$ = this._data.asObservable();

  setData(data: FsGalleryDataItem) {
    this._data.next(data);
  }

  private dataItem: FsGalleryDataItem = null;

  private _instance = null;

  set instance(value) {

    if (value && this._instance) {
      this.close();
    }

    this._instance = value;
  }

  get instance() {
    return this._instance;
  }

  get opened() {
    return !!this.instance;
  }

  constructor() {
    this.data$.subscribe((data: FsGalleryDataItem) => this.dataItem = data);
  }

  prev() {
    const index = this.instance.instance.fsGalleryService.getDataIndex(this.dataItem);
    let prevIndex = index ? index - 1 : 0;

    if (this.instance.instance.fsGalleryService.config.repeat && index === 0) {
      prevIndex = this.instance.instance.fsGalleryService.model.length - 1;
    }

    this.setData(this.instance.instance.fsGalleryService.model[prevIndex]);
  }

  next() {
    const index = this.instance.instance.fsGalleryService.getDataIndex(this.dataItem);
    const indexLast = this.instance.instance.fsGalleryService.model.length - 1;
    let nextIndex = index < indexLast ? index + 1 : indexLast;

    if (this.instance.instance.fsGalleryService.config.repeat && index === indexLast) {
      nextIndex = 0;
    }

    this.setData(this.instance.instance.fsGalleryService.model[nextIndex]);
  }

  close() {
    this.instance.destroy();
  }

}
