import {
  Component,
  Input,
  Output,
  ContentChild,
  ViewChild,
  EventEmitter,
  ElementRef,
  TemplateRef,
  KeyValueDiffers,
  NgZone,
  OnInit,
  DoCheck,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { FsFile } from '@firestitch/file';

import { FsGalleryPreviewDirective, FsGalleryThumbnailDirective } from '../../directives';
import { FS_GALLERY_ACCESSOR } from '../../value-accessors';
import { FsGalleryDataItem, FsGalleryConfig, FsGalleryUpdateImage, FsGalleryAddImage } from '../../interfaces';
import { FsGalleryThumbnailComponent } from '../fs-gallery-thumbnail';
import {
  FsGalleryService
} from '../../services';


@Component({
  selector: 'fs-gallery',
  templateUrl: './fs-gallery.component.html',
  styleUrls: [ './fs-gallery.component.scss' ],
  providers: [FS_GALLERY_ACCESSOR, FsGalleryService]
})
export class FsGalleryComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {

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

  @Output() public updateImage = new EventEmitter<FsGalleryUpdateImage>();
  @Output() public addImage = new EventEmitter<FsGalleryAddImage>();

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

  private _fsGalleryThumbnailsRef = null;

  private _onDragOver = $event => {
    $event.preventDefault();
  };

  private _onDragDrop = $event => {
    $event.preventDefault();
    if (this.fsGalleryService.isThumbnail($event.target)) {
      return;
    }

    if (!this.fsGalleryService.config.addImage) {
      return;
    }

    this.addImage.emit(this.fsGalleryService.seekForClosest($event));
  };

  _onTouched = () => { };
  _onChange = (value: any) => { };
  onFocused = (event: any) => { };

  registerOnChange(fn: (value: any) => any): void { this._onChange = fn }
  registerOnTouched(fn: () => any): void { this._onTouched = fn }

  constructor(
    public fsGalleryService: FsGalleryService,
    private _differs: KeyValueDiffers,
    private elementRef: ElementRef,
    private ngZone: NgZone
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

  public ngAfterViewInit() {
    this._fsGalleryThumbnailsRef = this.elementRef
                                       .nativeElement
                                       .getElementsByClassName('fs-gallery-thumbnails')[0];

    this.ngZone.runOutsideAngular(() => {
      if (this.fsGalleryService.config.addImage) {
        this._fsGalleryThumbnailsRef.addEventListener('dragover', this._onDragOver, false);
        this._fsGalleryThumbnailsRef.addEventListener('drop', this._onDragDrop, false);
      }
    });
  }

  public writeValue(value: FsGalleryDataItem[]): void {
    this.fsGalleryService.model = value;
    this._onChange(this.fsGalleryService.model);
    this.model = this.fsGalleryService.model;
  }

  public openPreview(data: FsGalleryDataItem) {
    this.fsGalleryThumbnail.openPreview(data);
  }

  public onUpdateImage(data: FsGalleryUpdateImage, fsFile: FsFile) {

    if (!this.fsGalleryService.config.updateImage) {
      return;
    }

    this.updateImage.emit({ data: data, file: fsFile });
  }

  public onUpdateImageClick($event) {
    $event.preventDefault();
  }

  public ngOnDestroy() {
    if (this.fsGalleryService.config.addImage) {
      this._fsGalleryThumbnailsRef.removeEventListener('dragover', this._onDragOver, false);
      this._fsGalleryThumbnailsRef.removeEventListener('drop', this._onDragDrop, false);
    }
  }

}
