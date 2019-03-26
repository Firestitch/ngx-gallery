import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FsGalleryPreviewService } from '../../../services/gallery-preview.service';
import { FsGalleryService } from '../../../services/gallery.service';
import { FsGalleryItem } from '../../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery-preview-carousel',
  templateUrl: './gallery-preview-carousel.component.html',
  styleUrls: [ './gallery-preview-carousel.component.scss' ]
})
export class FsGalleryPreviewCarouselComponent implements OnInit {

  public data$: BehaviorSubject<FsGalleryItem[]>;

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.data$ = this.fsGalleryService.data$;
  }

  onSelect(data: FsGalleryItem) {
    this.fsGalleryPreviewService.setData(data);
  }

}
