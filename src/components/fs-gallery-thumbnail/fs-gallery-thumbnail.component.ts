import { Component, Inject, Input, ViewContainerRef, OnInit } from '@angular/core';

import { FsGalleryDataItem } from '../../interfaces';
import {
  FsGalleryService,
  FsGalleryPreviewFactory,
  FsGalleryPreviewService
} from '../../services';


@Component({
  selector: 'fs-gallery-thumbnail',
  templateUrl: './fs-gallery-thumbnail.component.html',
  styleUrls: [ './fs-gallery-thumbnail.component.scss' ]
})
export class FsGalleryThumbnailComponent implements OnInit {

  @Input() public data: FsGalleryDataItem = null;

  public image: string = null;

  constructor(
    public fsGalleryService: FsGalleryService,
    private fsGalleryPreviewService: FsGalleryPreviewService,
    @Inject(ViewContainerRef) private viewContainerRef,
    private fsGalleryPreviewFactory: FsGalleryPreviewFactory
  ) { }

  ngOnInit() {
    this.image = this.fsGalleryService.getThumbnailImage(this.data);
  }

  openPreview() {
    this.fsGalleryPreviewFactory.setRootViewContainerRef(this.viewContainerRef);
    this.fsGalleryPreviewFactory.addDynamicComponent(this.data);
  }

}
