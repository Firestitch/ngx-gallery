import { Component, OnInit } from '@angular/core';
import { filter } from 'lodash-es';

import { FsGalleryPreviewService } from '../../../services/gallery-preview.service';
import { FsGalleryService } from '../../../services/gallery.service';
import { FsGalleryItem } from '../../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery-preview-carousel',
  templateUrl: './gallery-preview-carousel.component.html',
  styleUrls: [ './gallery-preview-carousel.component.scss' ]
})
export class FsGalleryPreviewCarouselComponent implements OnInit {

  public data$: FsGalleryItem[];

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.data$ = filter(this.fsGalleryService.data$.getValue(), item => {
      return item.galleryMime === 'image';
    });
  }

  onSelect(data: FsGalleryItem) {
    this.fsGalleryPreviewService.setData(data);
  }

}
