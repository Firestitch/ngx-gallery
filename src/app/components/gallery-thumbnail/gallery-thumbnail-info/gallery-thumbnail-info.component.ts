import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { FsGalleryItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services';
import { MimeType } from '../../../enums';


@Component({
  selector: 'fs-gallery-thumbnail-info',
  templateUrl: './gallery-thumbnail-info.component.html',
  styleUrls: ['./gallery-thumbnail-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryThumbnailInfoComponent implements OnInit {

  @Input() public item: FsGalleryItem;
  @Input() public showIcon;

  public MimeType = MimeType;
  public actions = [];

  constructor(
    public fsGalleryService: FsGalleryService,
  ) { }

  public ngOnInit(): void {
    if (typeof this.showIcon !== 'boolean') {
      this.showIcon = this.fsGalleryService.config.info.icon !== false;
    }

    if (this.fsGalleryService.config.info.menu) {
      this.actions = this.fsGalleryService.config.info.menu.actions
        .filter((action) => {
          return !action.show || action.show(this.item);
        })
        .map((action) => {
          const label = action.label instanceof Function ?
            action.label(this.item) : action.label;

          return {
            ...action,
            label,
          };
        });
    }
  }

  public menuClick(event, action, data) {
    action.click(data);
  }

}
