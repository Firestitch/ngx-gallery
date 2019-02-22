import {
  Component,
  Input,
  Output,
  ContentChild,
  ViewChild,
  EventEmitter,
  TemplateRef,
  KeyValueDiffers,
  OnInit,
  DoCheck, Provider, forwardRef
} from '@angular/core';

import { FsGalleryThumbnailComponent } from '../gallery-thumbnail/gallery-thumbnail.component';
import { FsGalleryService } from '../../services/gallery.service';

import { FsGalleryPreviewDirective } from '../../directives/gallery-preview.directive';
import { FsGalleryThumbnailDirective } from '../../directives/gallery-thumbnail.directive';

import { FsGalleryDataItem } from '../../interfaces/gallery-data-item';
import { FsGalleryConfig } from '../../interfaces/gallery-config';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


export const FS_GALLERY_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FsGalleryComponent),
  multi: true
};

@Component({
  selector: 'fs-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [ './gallery.component.scss' ],
  providers: [FS_GALLERY_ACCESSOR, FsGalleryService]
})
export class FsGalleryComponent implements OnInit, DoCheck {

  private _config: FsGalleryConfig = null;

  @Input() set config(value: FsGalleryConfig) {

    this._config = value;

    if (!this._differ) {
      this._differ = this._differs.find({}).create();
    }
  }

  get config(): FsGalleryConfig {
    return this._config;
  }

  @Output() public reorderImages = new EventEmitter<FsGalleryDataItem[]>();

  @ContentChild(FsGalleryPreviewDirective, { read: TemplateRef })
  public previewTemplate: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryPreviewDirective)
  public previewDirective: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryThumbnailDirective, { read: TemplateRef })
  public thumbnailTemplate: FsGalleryThumbnailDirective = null;

  @ContentChild(FsGalleryThumbnailDirective)
  public thumbnailDirective: FsGalleryThumbnailDirective = null;

  @ViewChild('fsGalleryThumbnail')
  public fsGalleryThumbnail: FsGalleryThumbnailComponent = null;

  public model: FsGalleryDataItem[] = [];

  private _differ = null;

  _onTouched = () => { };
  _onChange = (value: any) => { };
  onFocused = (event: any) => { };

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor(
    public fsGalleryService: FsGalleryService,
    private _differs: KeyValueDiffers
  ) { }

  public ngOnInit() {
    this.fsGalleryService.previewTemplate = this.previewTemplate;
    this.fsGalleryService.thumbnailTemplate = this.thumbnailTemplate;
    this.fsGalleryService.previewDirective = this.previewDirective;
    this.fsGalleryService.thumbnailDirective = this.thumbnailDirective;
  }

  public ngDoCheck() {
    const changes = this._differ.diff(this.config);
    if (changes && this.config) {
      this.fsGalleryService.config = this.config;
    }
  }

  public writeValue(value: FsGalleryDataItem[], reorder = false): void {
    this.fsGalleryService.model = value;
    this._onChange(this.fsGalleryService.model);
    this.model = this.fsGalleryService.model;

    if (reorder) {
      this.reorderImages.emit(this.fsGalleryService.model);
    }
  }

  public openPreview(data: FsGalleryDataItem) {
    this.fsGalleryThumbnail.openPreview(data);
  }

}
