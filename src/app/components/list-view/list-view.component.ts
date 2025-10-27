import { AfterViewInit, ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, inject } from '@angular/core';

import { FsListComponent, FsListConfig, FsListColumnDirective, FsListCellDirective, FsListHeaderDirective, FsListEmptyStateDirective } from '@firestitch/list';

import { GalleryConfig } from '../../classes/gallery.config';
import { GalleryView, MimeType } from '../../enums';
import { FsGalleryService } from '../../services/gallery.service';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { FsGalleryFileIconComponent } from '../gallery-file-icon/gallery-file-icon.component';


@Component({
    selector: 'fs-gallery-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsListComponent,
        NgClass,
        FsListColumnDirective,
        FsListCellDirective,
        FsGalleryFileIconComponent,
        FsListHeaderDirective,
        NgTemplateOutlet,
        FsListEmptyStateDirective,
        AsyncPipe,
    ],
})
export class FsGalleryListViewComponent implements AfterViewInit {
  private _galleryService = inject(FsGalleryService);


  @ViewChild(FsListComponent)
  public listRef: FsListComponent;

  public listConfig: FsListConfig;

  @Input()
  public galleryConfig: GalleryConfig;

  @Input()
  public imageWidth: number;

  public MimeType = MimeType;
  public GalleryView = GalleryView;

  constructor() {
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
