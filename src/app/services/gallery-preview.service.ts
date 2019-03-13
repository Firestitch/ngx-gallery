import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { FsGalleryDataItem } from '../interfaces/gallery-data-item.interface';
import { takeUntil } from 'rxjs/operators';


@Injectable()
export class FsGalleryPreviewService implements OnDestroy {

  private _data: BehaviorSubject<FsGalleryDataItem> = new BehaviorSubject<FsGalleryDataItem>(null);

  public data$ = this._data.asObservable();

  private dataItem: FsGalleryDataItem = null;

  private _instance = null;
  private _destroy$ = new Subject();

  constructor() {
    this.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((data: FsGalleryDataItem) => this.dataItem = data);
  }

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

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  setData(data: FsGalleryDataItem) {
    this._data.next(data);
  }

  prev() {
    const index = this.instance.instance.galleryService.getDataIndex(this.dataItem);
    const data = this.instance.instance.galleryService.data$.getValue();
    const repeat = this.instance.instance.galleryService.config.repeat;

    let prevIndex = index ? index - 1 : 0;

    if (repeat && index === 0) {
      prevIndex = data.length - 1;
    }

    this.setData(data[prevIndex]);
  }

  next() {
    const index = this.instance.instance.galleryService.getDataIndex(this.dataItem);
    const data = this.instance.instance.galleryService.data$.getValue();
    const repeat = this.instance.instance.galleryService.config.repeat;

    const indexLast = data.length - 1;
    let nextIndex = index < indexLast ? index + 1 : indexLast;

    if (repeat && index === indexLast) {
      nextIndex = 0;
    }

    this.setData(data[nextIndex]);
  }

  close() {
    this.instance.destroy();
  }

}
