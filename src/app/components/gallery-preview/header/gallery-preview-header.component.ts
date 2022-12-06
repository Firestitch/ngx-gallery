import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { FsGalleryItem, FsGalleryItemAction, FsGalleryPreviewAction, FsGalleryMenuItem } from '../../../interfaces';
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

  public previewMenuItems: FsGalleryMenuItem[] = [];
  public previewActions: FsGalleryPreviewAction[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.previewMenuItems = this.galleryService.config.previewMenu?.items || [];
      this.previewActions = this._processGalleryItemAction(this.galleryService.config.previewActions);
    }
  }

  public previewActionClick(action: FsGalleryMenuItem) {
    if (action.click) {
      action.click(this.item);
    }
  }

  public _processGalleryItemAction(actions: FsGalleryItemAction[]): any {
    return actions
      .filter((item: FsGalleryItemAction) => {
        return !item.show || item.show(this.item);
      });
  }

}
