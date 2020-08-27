import { Component, Input } from '@angular/core';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { GalleryLayout } from '../../enums';

@Component({
  selector: 'fs-gallery-thumbnail',
  templateUrl: './gallery-thumbnail.component.html',
  styleUrls: [ './gallery-thumbnail.component.scss' ]
})
export class FsGalleryThumbnailComponent {

  @Input() public data: FsGalleryItem = null;

  public galleryLayout = GalleryLayout;

  constructor(
    public galleryService: FsGalleryService,
  ) { }
}
