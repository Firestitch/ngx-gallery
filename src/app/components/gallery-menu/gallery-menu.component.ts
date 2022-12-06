import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { processMenuItems } from '../../helpers';

import { FsGalleryItem, FsGalleryItemAction, FsGalleryMenuItem } from '../../interfaces';


@Component({
  selector: 'fs-gallery-menu',
  templateUrl: './gallery-menu.component.html',
  styleUrls: ['./gallery-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryMenuComponent implements OnChanges {

  @Input() public item: FsGalleryItem;
  @Input() public menuItems: FsGalleryItemAction[];

  public visibleMenuItems: FsGalleryMenuItem[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.menuItems) {
      this.visibleMenuItems = processMenuItems(this.menuItems, this.item);
    }
  }

  public menuItemClick(menuItem: FsGalleryMenuItem) {
    if (menuItem.click) {
      menuItem.click(this.item);
    }
  }

}
