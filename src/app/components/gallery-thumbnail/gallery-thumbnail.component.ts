import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryDataItem } from '../../interfaces/gallery-data-item';
import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryPreviewService } from '../../services/gallery-preview.service';
import { FsGalleryPreviewFactory } from '../../services/gallery-preview-factory.service';

@Component({
  selector: 'fs-gallery-thumbnail',
  templateUrl: './gallery-thumbnail.component.html',
  styleUrls: [ './gallery-thumbnail.component.scss' ]
})
export class FsGalleryThumbnailComponent implements OnInit, OnDestroy {

  @Input() public data: FsGalleryDataItem = null;
  @Input() public carousel = false;
  @Input() public overwriteThumbnailTemplate = false;

  @Output() public select = new EventEmitter<FsGalleryDataItem>();

  public image: string = null;

  public isActive = false;

  private _destroy$ = new Subject();

  constructor(
    public fsGalleryService: FsGalleryService,
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryPreviewFactory: FsGalleryPreviewFactory,
    private viewContainerRef: ViewContainerRef
  ) { }

  public ngOnInit() {
    this.image = this.fsGalleryService.getThumbnailImage(this.data);

    if (this.carousel) {
      this.watchData();
    }
  }

  public watchData() {
    this.fsGalleryPreviewService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe(response => {

        this.isActive =
          response[this.fsGalleryService.config.indexField] === this.data[this.fsGalleryService.config.indexField];
      });
  }

  public onSelect() {
    this.select.emit(this.data);
  }

  public openPreview(data: FsGalleryDataItem) {
    this.fsGalleryPreviewFactory.setRootViewContainerRef(this.viewContainerRef);
    this.fsGalleryPreviewFactory.addDynamicComponent(data);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
