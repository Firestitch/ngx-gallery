import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Input() public hasInfo = false;
  @Input() public showIcon;
  @Input() public actions
  @Input() public name

  @Output() public hasInfoChange = new EventEmitter();

  public MimeType = MimeType;

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public ngOnInit(): void {
    if (this.showIcon === undefined) {
      this.showIcon = this.galleryService.config.info.icon !== false;
    }

    if (this.actions === undefined) {
      this.actions = this.galleryService.getInfoMenuItemActions(this.item);
    }

    if (this.name === undefined) {
      this.name = this.galleryService.getInfoItemName(this.item);
    }
  }

  public select(action, file) {
    action.select(this.item, file);
  }

  public menuClick(event, action, data) {
    action.click(data);
  }

}
