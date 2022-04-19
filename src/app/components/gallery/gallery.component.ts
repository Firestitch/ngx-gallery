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
  ContentChildren,
  QueryList,
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
import { GalleryView } from './../../enums';
import { FsGalleryConfig } from '../../interfaces/gallery-config.interface';
import { FsGalleryListColumnDirective } from '../../directives/column/column.directive';


@Component({
  selector: 'fs-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [ './gallery.component.scss' ],
  providers: [ FsGalleryService, PersistanceController ]
})
export class FsGalleryComponent implements OnInit, OnDestroy, AfterContentInit {

  @Output() zoomChanged = new EventEmitter();

  @Input() set config(value: FsGalleryConfig) {
    this._config = new GalleryConfig(value);
    this.galleryService.config = this._config;
  }

  @ContentChild(FsGalleryPreviewDirective, { read: TemplateRef })
  public previewTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryPreviewDirective)
  public previewDirective: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryThumbnailDirective, { read: TemplateRef })
  public thumbnailTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryThumbnailContainerDirective, { read: TemplateRef })
  public thumbnailContainerTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryThumbnailDirective)
  public thumbnailDirective: FsGalleryThumbnailDirective = null;

  @ViewChild('fsGalleryThumbnail')
  public fsGalleryThumbnail: FsGalleryThumbnailComponent = null;

  public data$: BehaviorSubject<FsGalleryItem[]>;
  public reorderEnabled = true;
  public GalleryView = GalleryView;

  @ContentChildren(FsGalleryListColumnDirective)
  private _listColumnDirectives: QueryList<FsGalleryListColumnDirective>;

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

    this.galleryService.thumbnailContainerTemplate = this.thumbnailContainerTemplate;

    this.galleryService.setListColumns(this._listColumnDirectives.toArray());
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public orderChange(value: FsGalleryItem[]): void {
    this.data$.next(value);

    if (this._config.reorderEnd) {
      this._config.reorderEnd(value);
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

  public reload() {
    this.galleryService.reload();
  }

}
