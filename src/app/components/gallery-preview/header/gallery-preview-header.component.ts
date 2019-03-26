import { Component, OnInit, OnDestroy } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryPreviewService } from '../../../services/gallery-preview.service';
import { FsGalleryService } from '../../../services/gallery.service';
import { FsGalleryItem } from '../../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './gallery-preview-header.component.html',
  styleUrls: [ './gallery-preview-header.component.scss' ]
})
export class FsGalleryPreviewHeaderComponent implements OnInit, OnDestroy {

  public data: FsGalleryItem = null;
  public data$: BehaviorSubject<FsGalleryItem[]>;
  public activeIndex = 0;

  private _destroy$ = new Subject();

  constructor(
    private galleryPreviewService: FsGalleryPreviewService,
    private galleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.data$ = this.galleryService.data$;
    this._subscribeToPreviewData();
  }

  close() {
    this.galleryPreviewService.close();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _subscribeToPreviewData() {
    this.galleryPreviewService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((response: FsGalleryItem) => {
        this.data = response;
        this.activeIndex = this.galleryService.getDataIndex(this.data);
      });
  }


}
