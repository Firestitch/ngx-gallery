import {
  Component,
  Input,
  ContentChild,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy,
  AfterContentInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { FsGalleryThumbnailComponent } from '../gallery-thumbnail/gallery-thumbnail.component';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryPreviewDirective } from '../../directives/gallery-preview.directive';

import { FsGalleryThumbnailDirective } from '../../directives/gallery-thumbnail.directive';
import { GalleryConfig } from '../../classes/gallery.config';
import { PersistanceController } from '../../classes/persistance-controller';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { FsGalleryThumbnailContainerDirective } from '../../directives/gallery-thumbnail-container.directive';
import { GalleryMode } from './../../enums';


@Component({
  selector: 'fs-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [ './gallery.component.scss' ],
  providers: [ FsGalleryService, PersistanceController ]
})
export class FsGalleryComponent implements OnInit, OnDestroy, AfterContentInit {

  @Output() zoomChanged = new EventEmitter();

  @Input() set config(value) {
    this._config = new GalleryConfig(value);
    this.galleryService.config = this.config;
  }

  get config(): GalleryConfig {
    return this._config;
  }

  @ContentChild(FsGalleryPreviewDirective, { read: TemplateRef })
  public previewTemplate: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryPreviewDirective)
  public previewDirective: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryThumbnailDirective, { read: TemplateRef })
  public thumbnailTemplate: FsGalleryThumbnailDirective = null;

  @ContentChild(FsGalleryThumbnailContainerDirective, { read: TemplateRef })
  public thumbnailContainerDirective: FsGalleryThumbnailContainerDirective = null;

  @ContentChild(FsGalleryThumbnailDirective)
  public thumbnailDirective: FsGalleryThumbnailDirective = null;

  @ViewChild('fsGalleryThumbnail')
  public fsGalleryThumbnail: FsGalleryThumbnailComponent = null;

  public data$: BehaviorSubject<FsGalleryItem[]>;
  public reorderEnabled = true;

  private _config: GalleryConfig = null;
  private _destroy$ = new Subject<void>();

  constructor(
    public galleryService: FsGalleryService,
  ) { }

  public ngOnInit() {
    this.data$ = this.galleryService.data$;
    this.reorderEnabled = this.galleryService.config.reorderable;
  }

  public ngAfterContentInit() {

    this.galleryService.previewTemplate = this.previewTemplate;
    this.galleryService.previewDirective = this.previewDirective;

    this.galleryService.thumbnailDirective = this.thumbnailDirective;
    this.galleryService.thumbnailTemplate = this.thumbnailTemplate;

    this.galleryService.thumbnailContainerDirective = this.thumbnailContainerDirective;
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public orderChange(value: FsGalleryItem[], reorder = false): void {

    this.data$.next(value);

    if (this.config.reorderEnd) {
      this.config.reorderEnd(value);
    }
  }

  public openPreview(item: FsGalleryItem) {
    this.galleryService.openPreview(item);
  }

  public isReorderEnabled() {
    return this.reorderEnabled;
  }

  public enableReorder() {

    if (this.galleryService.config.reorderable) {
      this.reorderEnabled = true;
    }
  }

  public disableReorder() {
    this.reorderEnabled = false;
  }

  public refresh() {
    this.galleryService.loadData();
  }

  public modeChange(mode: GalleryMode) {
    this.galleryService.mode = mode;
  }

}
