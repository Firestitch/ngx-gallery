import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GalleryLayout } from '../../enums';
import { FsGalleryItem } from '../../interfaces';
import { FsGalleryService } from '../../services';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { FsGalleryThumbnailPreviewComponent } from './gallery-thumbnail-preview/gallery-thumbnail-preview.component';
import { FsGalleryThumbnailInfoComponent } from './gallery-thumbnail-info/gallery-thumbnail-info.component';
import { FsGalleryMenuComponent } from '../gallery-menu/gallery-menu.component';


@Component({
    selector: 'fs-gallery-thumbnail',
    templateUrl: './gallery-thumbnail.component.html',
    styleUrls: ['./gallery-thumbnail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        NgTemplateOutlet,
        FsGalleryThumbnailPreviewComponent,
        FsGalleryThumbnailInfoComponent,
        FsGalleryMenuComponent,
    ],
})
export class FsGalleryThumbnailComponent implements OnInit, OnDestroy {
  galleryService = inject(FsGalleryService);
  private _cdRef = inject(ChangeDetectorRef);


  @Input() public item: FsGalleryItem = null;
  @Input() public index;
  @Input() public first;
  @Input() public last;

  public galleryLayout = GalleryLayout;
  public hasInfo = false;
  public infoMenuItems = [];
  public menuOpened = false;

  private _destroy$ = new Subject();

  public ngOnInit(): void {
    this.galleryService.config.thumbnailScale$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });

    this.hasInfo = (
      !!this.galleryService.config.info.icon ||
      !!this.galleryService.getInfoItemName(this.item) 
    );
  }

  public menuOpenChange(value: boolean) {
    this.menuOpened = value;
    this._cdRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
