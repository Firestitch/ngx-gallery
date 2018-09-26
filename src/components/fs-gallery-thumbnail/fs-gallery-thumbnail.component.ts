import { Component, Input, OnInit } from '@angular/core';

import { get } from 'lodash';

import { FsGalleryService } from '../../services';
import { FsGalleryDataItem } from '../../interfaces';


@Component({
  selector: 'fs-gallery-thumbnail',
  templateUrl: './fs-gallery-thumbnail.component.html',
  styleUrls: [ './fs-gallery-thumbnail.component.scss' ]
})
export class FsGalleryThumbnailComponent implements OnInit {

  @Input() public data: FsGalleryDataItem = null;

  public image: string = null;

  constructor(public fsGalleryService: FsGalleryService) { }

  ngOnInit() {
    this.image = get(this.data, this.fsGalleryService.thumbnailDirective.image, null);
  }

}
