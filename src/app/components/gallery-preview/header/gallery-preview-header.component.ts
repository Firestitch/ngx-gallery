import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryPreviewService } from '../../../services/gallery-preview.service';
import { FsGalleryService } from '../../../services/gallery.service';
import { FsGalleryDataItem } from '../../../interfaces/gallery-data-item';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './gallery-preview-header.component.html',
  styleUrls: [ './gallery-preview-header.component.scss' ]
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
