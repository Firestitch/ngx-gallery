import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { FsListConfig } from '@firestitch/list';

import { GalleryConfig } from '../../classes/gallery.config';
import { GalleryView, MimeType } from '../../enums';
import { FsGalleryService } from '../../services/gallery.service';


@Component({
  selector: 'fs-gallery-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryListViewComponent {

  public listConfig: FsListConfig;

  @Input()
  public galleryConfig: GalleryConfig;

  @Input()
  public imageWidth: number;

  public MimeType = MimeType;
  public GalleryView = GalleryView;

  constructor(
    private _galleryService: FsGalleryService,
  ) {
    this.listConfig = this._galleryService.listConfig;
  }

  public get emptyStateTemplate(): TemplateRef<any> {
    return this._galleryService.emptyStateTemplate;
  }

  public openPreview = (item) => {
    this._galleryService.openPreview(item);
  }
}
