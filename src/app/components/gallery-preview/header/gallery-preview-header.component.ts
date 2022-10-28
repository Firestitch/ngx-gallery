import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

import { FsGalleryItem, FsGalleryPreviewAction } from '../../../interfaces';
import { FsGalleryService } from '../../../services';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './gallery-preview-header.component.html',
  styleUrls: ['./gallery-preview-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryPreviewHeaderComponent implements OnInit {

  @Input() public item: FsGalleryItem;
  @Input() public galleryService: FsGalleryService;

  @Output() public previewClosed = new EventEmitter<void>();
  @Output() public detailsToggled = new EventEmitter<void>();

  public previewActions = [];

  public ngOnInit(): void {
    this.previewActions = this.galleryService.config.previewActions
      .filter((preveiwAction: FsGalleryPreviewAction) => {
        return !preveiwAction.show || preveiwAction.show(this.item);
      });

  }

}
