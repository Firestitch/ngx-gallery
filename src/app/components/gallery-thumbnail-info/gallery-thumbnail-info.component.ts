import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { FsGalleryService } from '../../services/gallery.service';
import { MimeType } from '../../enums';

@Component({
  selector: 'fs-gallery-thumbnail-info',
  templateUrl: './gallery-thumbnail-info.component.html',
  styleUrls: ['./gallery-thumbnail-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryThumbnailInfoComponent {

  @Input() public item: FsGalleryItem = null;

  public MimeType = MimeType;

  constructor(
    public fsGalleryService: FsGalleryService,
  ) { }

  public menuClick(event, action, data) {
    action.click(data.data);
  }

}
