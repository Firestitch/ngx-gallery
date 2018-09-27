import { Component, OnInit } from '@angular/core';

import { FsGalleryPreviewService, FsGalleryService } from '../../services';
import { FsGalleryDataItem } from '../../interfaces';


@Component({
  selector: 'fs-gallery-preview',
  templateUrl: './fs-gallery-preview.component.html',
  styleUrls: [ './fs-gallery-preview.component.scss' ]
})
export class FsGalleryPreviewComponent implements OnInit {

  public data: FsGalleryDataItem = null;

  public image: string = null;

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    private fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.image = this.fsGalleryService.getPreviewImage(this.data);
  }

  close($event) {
    this.fsGalleryPreviewService.close();
  }

}
