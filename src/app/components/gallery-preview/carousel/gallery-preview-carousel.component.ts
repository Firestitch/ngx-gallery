import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FsGalleryPreviewService } from '../../../services/gallery-preview.service';
import { FsGalleryService } from '../../../services/gallery.service';

import { FsGalleryDataItem } from '../../../interfaces/gallery-data-item.interface';


@Component({
  selector: 'fs-gallery-preview-carousel',
  templateUrl: './gallery-preview-carousel.component.html',
  styleUrls: [ './gallery-preview-carousel.component.scss' ]
})
export class FsGalleryPreviewCarouselComponent implements OnInit {

  public data$: BehaviorSubject<FsGalleryDataItem[]>;

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.data$ = this.fsGalleryService.data$;
  }

  onSelect(data: FsGalleryDataItem) {
    this.fsGalleryPreviewService.setData(data);
  }

}
