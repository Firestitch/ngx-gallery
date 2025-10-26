import {
  ChangeDetectionStrategy, Component,
  EventEmitter,
  HostBinding, Input, OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { processMenuItems } from '../../helpers';
import { FsGalleryItem, FsGalleryItemAction } from '../../interfaces';
import { FsMenuModule } from '@firestitch/menu';


@Component({
    selector: 'fs-gallery-menu',
    templateUrl: './gallery-menu.component.html',
    styleUrls: ['./gallery-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsMenuModule],
})
export class FsGalleryMenuComponent implements OnChanges {

  @HostBinding('class.open')
  public open = false;

  @Input() public item: FsGalleryItem;
  @Input() public buttonType: 'icon' | 'miniFab' = 'icon';
  @Input() public itemActions: FsGalleryItemAction[];

  @Output() public openChange = new EventEmitter<boolean>();

  public visibleMenuItems: FsGalleryItemAction[] = [];

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.itemActions) {
      this.visibleMenuItems = processMenuItems(this.itemActions, this.item);
    }
  }

  public menuItemClick(menuItem: FsGalleryItemAction) {
    if (menuItem.click) {
      menuItem.click(this.item);
    }
  }

  public switchOpen(value: boolean) {
    this.open = value;
    this.openChange.emit(value);
  }

}
