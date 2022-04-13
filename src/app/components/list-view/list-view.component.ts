import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { GalleryConfig } from '../../classes/gallery.config';
import { GalleryMode, MimeType } from '../../enums';
import { FsGalleryService } from '../../services/gallery.service';


@Component({
  selector: 'fs-gallery-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: [
    './list-view.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryListViewComponent {

  @Input()
  public listConfig: FsListConfig;

  @Input()
  public galleryConfig: GalleryConfig;

  @Input()
  public imageWidth: number;

  @ViewChild(FsListComponent)
  set updateListRef(listRef) {
    this.galleryConfig.setListRef(listRef);
  }

  public MimeType = MimeType;
  public GalleryMode = GalleryMode;

  constructor(
    private _galleryService: FsGalleryService,
  ) {
  }

  public openPreview = (item) => {
    this._galleryService.openPreview(item);
  }
}
