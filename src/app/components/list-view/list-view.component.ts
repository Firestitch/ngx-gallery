import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { FsListComponent, FsListConfig } from '@firestitch/list';

import { GalleryConfig } from '../../classes/gallery.config';
import { GalleryView, MimeType } from '../../enums';
import { FsGalleryService } from '../../services/gallery.service';


@Component({
  selector: 'fs-gallery-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryListViewComponent implements AfterViewInit {

  @ViewChild(FsListComponent)
  public listRef: FsListComponent;

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

  public ngAfterViewInit(): void {
    this._galleryService.setLister(this.listRef);
  }

  public openPreview = (item) => {
    this._galleryService.openPreview(item);
  };
}
