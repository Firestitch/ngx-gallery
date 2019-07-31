import { Component, Input } from '@angular/core';

import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { FsGalleryService } from '../../services/gallery.service';

@Component({
  selector: 'fs-gallery-thumbnail-info',
  templateUrl: './gallery-thumbnail-info.component.html',
  styleUrls: [ './gallery-thumbnail-info.component.scss' ]
})
export class FsGalleryThumbnailInfoComponent {

  @Input() public item: FsGalleryItem = null;

  constructor(
    public fsGalleryService: FsGalleryService,
  ) { }

  public menuClick(event, action, data) {
    action.click(data);
  }
}
