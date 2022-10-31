import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { FsGalleryItem, FsGalleryPreviewAction, FsGalleryPreviewMenuItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './gallery-preview-header.component.html',
  styleUrls: ['./gallery-preview-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryPreviewHeaderComponent implements OnChanges {

  @Input() public item: FsGalleryItem;
  @Input() public galleryService: FsGalleryService;

  @Output() public previewClosed = new EventEmitter<void>();
  @Output() public detailsToggled = new EventEmitter<void>();

  public previewMenuItems = [];
  public previewActions = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      const previewMenuItems = this.galleryService.config.previewMenu?.items || [];
      if (previewMenuItems) {
        this.previewMenuItems = previewMenuItems
          .filter((item: FsGalleryPreviewMenuItem) => {
            return !item.show || item.show(this.item);
          })
          .map((item: FsGalleryPreviewMenuItem) => {
            return {
              ...item,
              label: item.label instanceof Function ?
                item.label(this.item) : item.label,
            }
          });
      }

      this.previewActions = this.galleryService.config.previewActions
        .filter((item: FsGalleryPreviewAction) => {
          return !item.show || item.show(this.item);
        });
    }
  }

}
