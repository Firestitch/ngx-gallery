import { Component, Input, ContentChild, TemplateRef, OnInit } from '@angular/core';

import { FsGalleryPreviewDirective, FsGalleryThumbnailDirective } from '../../directives';
import { FS_GALLERY_ACCESSOR } from '../../value-accessors';
import { FsGalleryDataItem, FsGalleryConfig } from '../../interfaces';
import { FsGalleryService } from '../../services';


@Component({
  selector: 'fs-gallery',
  templateUrl: './fs-gallery.component.html',
  styleUrls: [ './fs-gallery.component.scss' ],
  providers: [FS_GALLERY_ACCESSOR, FsGalleryService]
})
export class FsGalleryComponent implements OnInit {

  @Input() public config: FsGalleryConfig = null;

  @ContentChild(FsGalleryPreviewDirective, { read: TemplateRef })
  public previewTemplate: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryPreviewDirective)
  public previewDirective: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryThumbnailDirective, { read: TemplateRef })
  public thumbnailTemplate: FsGalleryThumbnailDirective = null;

  @ContentChild(FsGalleryThumbnailDirective)
  public thumbnailDirective: FsGalleryThumbnailDirective = null;

  public model: FsGalleryDataItem[] = [];

  _onTouched = () => { };
  _onChange = (value: any) => { };
  onFocused = (event: any) => { };

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor(private fsGalleryService: FsGalleryService) { }

  ngOnInit() {
    this.fsGalleryService.previewTemplate = this.previewTemplate;
    this.fsGalleryService.thumbnailTemplate = this.thumbnailTemplate;
    this.fsGalleryService.previewDirective = this.previewDirective;
    this.fsGalleryService.thumbnailDirective = this.thumbnailDirective;
    this.fsGalleryService.config = this.config;
  }

  writeValue(value: FsGalleryDataItem[]): void {
    this.fsGalleryService.model = value;
    this._onChange(this.fsGalleryService.model);
    this.model = this.fsGalleryService.model;
  }
}
