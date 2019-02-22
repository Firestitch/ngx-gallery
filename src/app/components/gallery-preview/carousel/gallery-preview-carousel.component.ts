import { Component, OnInit } from '@angular/core';

import { FsGalleryPreviewService } from '../../../services/gallery-preview.service';
import { FsGalleryService } from '../../../services/gallery.service';

import { FsGalleryDataItem } from '../../../interfaces/gallery-data-item';


@Component({
  selector: 'fs-gallery-preview-carousel',
  templateUrl: './gallery-preview-carousel.component.html',
  styleUrls: [ './gallery-preview-carousel.component.scss' ]
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

  onSelect(data: FsGalleryDataItem) {
    this.fsGalleryPreviewService.setData(data);
  }

}
