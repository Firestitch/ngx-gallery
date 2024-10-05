import {
  ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges,
} from '@angular/core';

import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { GalleryThumbnailSize, MimeType } from '../../../enums';
import { FsGalleryConfig, FsGalleryItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services';


@Component({
  selector: 'fs-gallery-thumbnail-preview',
  templateUrl: './gallery-thumbnail-preview.component.html',
  styleUrls: ['./gallery-thumbnail-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryThumbnailPreviewComponent implements OnChanges, OnDestroy, OnInit {

  @Input() public item: FsGalleryItem;
  @Input() public imageHeight: number;
  @Input() public imageWidth: number;

  public MimeType = MimeType;
  public iconWidth;
  public iconHeight;
  public preview: string | FsApiFile | File | FsFile;
  public GalleryThumbnailSize = GalleryThumbnailSize;
  public styles = {
    width: null,
    height: null,
  };

  private _destroy$ = new Subject();

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public ngOnInit(): void {
    this.preview = this.item.preview;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageWidth || changes.imageHeight) {
      if (this.imageHeight > this.imageWidth) {
        this.iconHeight = this.imageHeight * .7;
        this.iconHeight = this.iconHeight > 90 ? 90 : this.iconHeight;
        this.iconWidth = null;
      } else {
        this.iconWidth = this.imageWidth * .5;
        this.iconWidth = this.iconWidth > 70 ? 70 : this.iconWidth;
        this.iconHeight = null;
      }
    }
  }

  public click(galleryItem: FsGalleryItem) {
    if (galleryItem.folder) {
      this.galleryService.openItem(galleryItem);
    } else {
      if (this.galleryService.config.preview) {
        this.galleryService.beforeOpenPreview(galleryItem)
          .pipe(
            filter((item) => !!item),
            takeUntil(this._destroy$),
          )
          .subscribe((item) => {
            this.galleryService.openPreview(item);
          });

        if (this.galleryService.config.previewClick) {
          this.galleryService.config.previewClick(galleryItem);
        }
      }
    }
  }

  public get config(): FsGalleryConfig {
    return this.galleryService.config;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
