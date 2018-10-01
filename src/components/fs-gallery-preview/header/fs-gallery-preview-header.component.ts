import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryPreviewService, FsGalleryService } from '../../../services';
import { FsGalleryDataItem } from '../../../interfaces';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './fs-gallery-preview-header.component.html',
  styleUrls: [ './fs-gallery-preview-header.component.scss' ]
})
export class FsGalleryPreviewHeaderComponent implements OnInit, OnDestroy {

  public data: FsGalleryDataItem = null;
  public model: FsGalleryDataItem[] = [];
  public activeIndex = 0;

  private _destroy$ = new Subject();

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.model = this.fsGalleryService.model;

    this.fsGalleryPreviewService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: FsGalleryDataItem) => {
        this.data = response;
        this.activeIndex = this.fsGalleryService.getDataIndex(this.data);
      });
  }

  close() {
    this.fsGalleryPreviewService.close();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
