import { Component, OnInit } from '@angular/core';

import { FsGalleryPreviewService, FsGalleryService } from '../../../services';
import { FsGalleryDataItem } from '../../../interfaces';


@Component({
  selector: 'fs-gallery-preview-carousel',
  templateUrl: './fs-gallery-preview-carousel.component.html',
  styleUrls: [ './fs-gallery-preview-carousel.component.scss' ]
})
export class FsGalleryPreviewCarouselComponent implements OnInit {

  public model: FsGalleryDataItem[] = [];

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.model = this.fsGalleryService.model;
  }

}
