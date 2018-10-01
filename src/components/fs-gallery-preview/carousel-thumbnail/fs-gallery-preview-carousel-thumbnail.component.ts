import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryPreviewService, FsGalleryService } from '../../../services';
import { FsGalleryDataItem } from '../../../interfaces';


@Component({
  selector: 'fs-gallery-preview-carousel-thumbnail',
  templateUrl: './fs-gallery-preview-carousel-thumbnail.component.html',
  styleUrls: [ './fs-gallery-preview-carousel-thumbnail.component.scss' ]
})
export class FsGalleryPreviewCarouselThumbnailComponent implements OnInit, OnDestroy {

  @Input() public data: FsGalleryDataItem = null;

  @Output() public select = new EventEmitter<FsGalleryDataItem>();

  public image: string = null;

  public isActive = false;

  private _destroy$ = new Subject();

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.image = this.fsGalleryService.getThumbnailImage(this.data);

    this.fsGalleryPreviewService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {

        this.isActive =
          response[this.fsGalleryService.config.indexField] === this.data[this.fsGalleryService.config.indexField];
      });
  }

  onSelect() {
    this.select.emit(this.data);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
