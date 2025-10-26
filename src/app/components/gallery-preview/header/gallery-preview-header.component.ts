import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';


import { FsGalleryItem, FsGalleryItemAction } from '../../../interfaces';
import { FsGalleryService } from '../../../services';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FsFileModule } from '@firestitch/file';
import { NgTemplateOutlet } from '@angular/common';
import { FsGalleryMenuComponent } from '../../gallery-menu/gallery-menu.component';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
    selector: 'fs-gallery-preview-header',
    templateUrl: './gallery-preview-header.component.html',
    styleUrls: ['./gallery-preview-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatIconButton,
        MatIcon,
        FsFileModule,
        NgTemplateOutlet,
        FsGalleryMenuComponent,
        MatTooltip,
    ],
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
