import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryPreviewService, FsGalleryService } from '../../services';
import { FsGalleryDataItem } from '../../interfaces';


@Component({
  selector: 'fs-gallery-preview',
  templateUrl: './fs-gallery-preview.component.html',
  styleUrls: [ './fs-gallery-preview.component.scss' ]
})
export class FsGalleryPreviewComponent implements OnInit, OnDestroy {

  public data: FsGalleryDataItem = null;

  public image: string = null;

  private _destroy$ = new Subject();

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    public fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.fsGalleryPreviewService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((data: FsGalleryDataItem) => {
        this.data = data;
        this.image = this.fsGalleryService.getPreviewImage(this.data);
      });
  }

  close($event) {
    this.fsGalleryPreviewService.close();
  }

  prev() {
    this.fsGalleryPreviewService.prev();
  }

  next() {
    this.fsGalleryPreviewService.next();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
