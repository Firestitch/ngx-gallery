import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

import { FsGalleryService } from '../../services';
import { FsGalleryConfig, FsGalleryItem } from '../../interfaces';
import { GalleryThumbnailSize, MimeType } from '../../enums';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'fs-gallery-thumbnail-preview',
  templateUrl: './gallery-thumbnail-preview.component.html',
  styleUrls: ['./gallery-thumbnail-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryThumbnailPreviewComponent implements OnChanges, OnDestroy {

  @Input() public item: FsGalleryItem;
  @Input() public imageHeight: number;
  @Input() public imageWidth: number;

  public MimeType = MimeType;
  public iconWidth = 80;
  public GalleryThumbnailSize = GalleryThumbnailSize;
  public styles = {
    width: null,
    height: null,
  };

  private _destroy$ = new Subject();

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageWidth || changes.imageHeight) {
      if (this.imageWidth) {
        this.iconWidth = this.imageWidth * .4;
      } else if (this.imageHeight) {
        this.iconWidth = this.imageHeight * .4;
      }
    }

    this.iconWidth = this.iconWidth > 120 ? 120 : this.iconWidth;
  }

  public click(item: FsGalleryItem) {
    if (item.folder) {
      this.galleryService.openItem(item);
    } else {
      if (this.galleryService.config.preview) {
        this.galleryService.beforeOpenPreview(item)
          .pipe(
            filter((item) => !!item),
            takeUntil(this._destroy$),
          )
          .subscribe((item) => {
            this.galleryService.openPreview(item);
          });

        if (this.galleryService.config.previewClick) {
          this.galleryService.config.previewClick(item);
        }
      }
    }
  }

  public get config(): FsGalleryConfig {
    return this.galleryService.config;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
