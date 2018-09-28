import { Component, OnInit } from '@angular/core';

import { FsGalleryPreviewService } from '../../../services';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './fs-gallery-preview-header.component.html',
  styleUrls: [ './fs-gallery-preview-header.component.scss' ]
})
export class FsGalleryPreviewHeaderComponent implements OnInit {

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService
  ) { }

  ngOnInit() {

  }

  close() {
    this.fsGalleryPreviewService.close();
  }

}
