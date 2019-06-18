import {
  Component,
  Input,
  Output,
  ContentChild,
  ViewChild,
  EventEmitter,
  TemplateRef,
  OnInit,
  Injector,
  OnDestroy,
} from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FsGalleryThumbnailComponent } from '../gallery-thumbnail/gallery-thumbnail.component';

import { FsGalleryPreviewService } from '../../services/gallery-preview.service';
import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryPreviewDirective } from '../../directives/gallery-preview.directive';

import { FsGalleryThumbnailDirective } from '../../directives/gallery-thumbnail.directive';
import { GalleryConfig } from '../../classes/gallery.config';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: [ './gallery.component.scss' ],
  providers: [ FsGalleryService ]
})
export class FsGalleryComponent implements OnInit, OnDestroy {

  @Input() set config(value) {
    this._config = new GalleryConfig(value);
    this.galleryService.config = this.config;
  }

  get config(): GalleryConfig {
    return this._config;
  }

  @Output() public reorderImages = new EventEmitter<FsGalleryItem[]>();
  @Output() public previewOpened = new EventEmitter<void>();
  @Output() public previewClosed = new EventEmitter<void>();

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

  public data$: BehaviorSubject<FsGalleryItem[]>;
  public dragEnabled = true;

  private _config: GalleryConfig = null;
  private _destroy$ = new Subject<void>();

  constructor(
    public galleryService: FsGalleryService,
    private galleryPreviewService: FsGalleryPreviewService,
    private _injector: Injector,
  ) { }

  public ngOnInit() {
    this.galleryService.previewTemplate = this.previewTemplate;
    this.galleryService.thumbnailTemplate = this.thumbnailTemplate;
    this.galleryService.previewDirective = this.previewDirective;
    this.galleryService.thumbnailDirective = this.thumbnailDirective;

    this.data$ = this.galleryService.data$;
    this.dragEnabled = this.galleryService.config.draggable;
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public orderChange(value: FsGalleryItem[], reorder = false): void {

    if (this.config.reorderEnd) {
      this.config.reorderEnd(this.data$.getValue());
    }

    this.data$.next(value);

    if (reorder) {
      this.reorderImages.emit(this.data$.getValue());
    }
  }

  public openPreview(data: FsGalleryItem) {
    if (data.galleryMime === 'image') {
      this.galleryPreviewService.open(this._injector, data)
        .onClose
        .pipe(
          take(1),
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          this.previewClosed.emit();
        });

      this.previewOpened.emit();
    }
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
