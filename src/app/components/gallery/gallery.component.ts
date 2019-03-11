import {
  Component,
  Input,
  Output,
  ContentChild,
  ViewChild,
  EventEmitter,
  TemplateRef,
  OnInit,
} from '@angular/core';

import { FsGalleryThumbnailComponent } from '../gallery-thumbnail/gallery-thumbnail.component';
import { FsGalleryService } from '../../services/gallery.service';

import { FsGalleryPreviewDirective } from '../../directives/gallery-preview.directive';
import { FsGalleryThumbnailDirective } from '../../directives/gallery-thumbnail.directive';

import { FsGalleryDataItem } from '../../interfaces/gallery-data-item.interface';
import { GalleryConfig } from '../../classes/gallery.config';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'fs-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [ './gallery.component.scss' ],
  providers: [ FsGalleryService ]
})
export class FsGalleryComponent implements OnInit {

  private _config: GalleryConfig = null;

  @Input() set config(value) {
    this._config = new GalleryConfig(value);
    this.galleryService.config = this.config;
  }

  get config(): GalleryConfig {
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

  public data$: BehaviorSubject<FsGalleryDataItem[]>;
  public dragEnabled = true;

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public ngOnInit() {
    this.galleryService.previewTemplate = this.previewTemplate;
    this.galleryService.thumbnailTemplate = this.thumbnailTemplate;
    this.galleryService.previewDirective = this.previewDirective;
    this.galleryService.thumbnailDirective = this.thumbnailDirective;

    this.data$ = this.galleryService.data$;
    this.dragEnabled = this.galleryService.config.draggable;
  }

  public orderChange(value: FsGalleryDataItem[], reorder = false): void {
    this.data$.next(value);

    if (reorder) {
      this.reorderImages.emit(this.data$.getValue());
    }
  }

  public openPreview(data: FsGalleryDataItem) {
    this.fsGalleryThumbnail.openPreview(data);
  }

  public isDragEnabled() {
    return this.dragEnabled;
  }

  public enableDrag() {
    this.dragEnabled = true;
  }

  public disableDrag() {
    this.dragEnabled = false;
  }

  public refresh() {
    this.galleryService.loadData();
  }
}
