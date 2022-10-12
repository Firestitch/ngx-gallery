import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { FsGalleryItem } from '../../../interfaces/gallery-config.interface';
import { FsGalleryService } from '../../../services/gallery.service';
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

  constructor(
    public fsGalleryService: FsGalleryService,
  ) { }

  public ngOnInit(): void {
    if (typeof this.showIcon !== 'boolean') {
      this.showIcon = this.fsGalleryService.config.info.icon !== false;
    }
  }

  public menuClick(event, action, data) {
    action.click(data);
  }

}
