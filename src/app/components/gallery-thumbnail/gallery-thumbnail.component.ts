import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FsGalleryService } from '../../services';
import { FsGalleryItem } from '../../interfaces';
import { GalleryLayout } from '../../enums';


@Component({
  selector: 'fs-gallery-thumbnail',
  templateUrl: './gallery-thumbnail.component.html',
  styleUrls: ['./gallery-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryThumbnailComponent implements OnInit {

  @Input() public item: FsGalleryItem = null;
  @Input() public index;
  @Input() public first;
  @Input() public last;

  public galleryLayout = GalleryLayout;
  public hasInfo = false;
  public infoMenuActions = [];

  private _destroy$ = new Subject();

  constructor(
    public galleryService: FsGalleryService,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.galleryService.config.thumbnailScale$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });

    this.infoMenuActions = this.galleryService.getInfoMenuItemActions(this.item);
    this.hasInfo = !!this.infoMenuActions.length || this.galleryService.config.info?.icon || !!this.galleryService.getInfoItemName(this.item);
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
