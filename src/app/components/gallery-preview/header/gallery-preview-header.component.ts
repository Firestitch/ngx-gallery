import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';


import { FsGalleryItem, FsGalleryItemAction } from '../../../interfaces';
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

  public menuItemActions: FsGalleryItemAction[] = [];
  public buttonItemActions: FsGalleryItemAction[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      const itemActions = this._processGalleryItemAction(this.galleryService.config.itemActions);
      this.buttonItemActions = itemActions
        .filter((item: FsGalleryItemAction) => item.icon && !item.menu);

      this.menuItemActions = itemActions
        .filter((item) => !this.buttonItemActions.includes(item));
    }
  }

  public previewActionClick(action: FsGalleryItemAction) {
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
