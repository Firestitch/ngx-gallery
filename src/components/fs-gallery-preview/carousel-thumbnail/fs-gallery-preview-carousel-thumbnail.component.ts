import { Component, Input, OnInit } from '@angular/core';

import { FsGalleryPreviewService, FsGalleryService } from '../../../services';
import { FsGalleryDataItem } from '../../../interfaces';


@Component({
  selector: 'fs-gallery-preview-carousel-thumbnail',
  templateUrl: './fs-gallery-preview-carousel-thumbnail.component.html',
  styleUrls: [ './fs-gallery-preview-carousel-thumbnail.component.scss' ]
})
export class FsGalleryPreviewCarouselThumbnailComponent implements OnInit {

  @Input() public data: FsGalleryDataItem = null;

  public image: string = null;

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.image = this.fsGalleryService.getThumbnailImage(this.data);
  }

}
