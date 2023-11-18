import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { SafeUrl } from '@angular/platform-browser';
import { FsApiFile } from '@firestitch/api';
import { Observable, ReplaySubject, Subject } from 'rxjs';
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
  public GalleryThumbnailSize = GalleryThumbnailSize;
  public styles = {
    width: null,
    height: null,
  };

  private _preview$ = new ReplaySubject<SafeUrl>();

  private _destroy$ = new Subject();

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public get preview$(): Observable<SafeUrl> {
    return this._preview$.asObservable();
  }

  public ngOnInit(): void {
    if (this.config.thumbnail.size === GalleryThumbnailSize.Contain) {
      if (this.item.preview instanceof FsApiFile) {
        this.item.preview.safeBase64Url
          .subscribe((base64) => {
            this._preview$.next(base64);
          });

      } else {
        this._preview$.next(this.item.preview);
      }
    } else if (this.config.thumbnail.size === GalleryThumbnailSize.Cover) {
      if (this.item.preview instanceof FsApiFile) {
        this.item.preview.base64
          .subscribe((base64) => {
            this._preview$.next(`url(${base64})`);
          });

      } else {
        this._preview$.next(`url(${this.item.preview})`);
      }
    }
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
