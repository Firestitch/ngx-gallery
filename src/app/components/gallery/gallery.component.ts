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
  HostBinding,
} from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FsGalleryThumbnailComponent } from '../gallery-thumbnail/gallery-thumbnail.component';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryPreviewDirective } from '../../directives/gallery-preview.directive';

import { FsGalleryThumbnailDirective } from '../../directives/gallery-thumbnail.directive';
import { GalleryConfig } from '../../classes/gallery.config';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { FsGalleryThumbnailContainerDirective } from '../../directives/gallery-thumbnail-container.directive';
import { DragulaService } from 'ng2-dragula';


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

  @ContentChild(FsGalleryPreviewDirective, { static: false, read: TemplateRef })
  public previewTemplate: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryPreviewDirective, { static: false })
  public previewDirective: FsGalleryPreviewDirective = null;

  @ContentChild(FsGalleryThumbnailDirective, { static: false, read: TemplateRef })
  public thumbnailTemplate: FsGalleryThumbnailDirective = null;

  @ContentChild(FsGalleryThumbnailContainerDirective, { static: false, read: TemplateRef })
  public thumbnailContainerDirective: FsGalleryThumbnailContainerDirective = null;

  @ContentChild(FsGalleryThumbnailDirective, { static: false })
  public thumbnailDirective: FsGalleryThumbnailDirective = null;

  @ViewChild('fsGalleryThumbnail', { static: false })
  public fsGalleryThumbnail: FsGalleryThumbnailComponent = null;

  public data$: BehaviorSubject<any>;
  public reorderEnabled = true;

  private _config: GalleryConfig = null;
  private _destroy$ = new Subject<void>();

  constructor(
    public galleryService: FsGalleryService,
    private _dragula: DragulaService,
  ) { }

  public ngOnInit() {
    this.galleryService.previewTemplate = this.previewTemplate;
    this.galleryService.previewDirective = this.previewDirective;

    this.galleryService.thumbnailDirective = this.thumbnailDirective;
    this.galleryService.thumbnailTemplate = this.thumbnailTemplate;

    this.galleryService.thumbnailContainerDirective = this.thumbnailContainerDirective;

    this.data$ = this.galleryService.data$;
    this.reorderEnabled = this.galleryService.config.reorderable;

    if (this.config.groupsMode) {
      const group = this._dragula.createGroup('GROUPS', {
        moves: (
          el,
          source,
          handle
        ) => {
          return handle.className === 'group-title'
        },
        direction: 'vertical',
      });

      console.log(group);

      // group.drake.on()
    }
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public orderChange(value: FsGalleryItem[], relatedGroup): void {

    if (!this.galleryService.groupConfig) {
      this.data$.next(value);
    }

    if (this.config.reorderEnd) {
      this.config.reorderEnd(value, relatedGroup);
    }
  }

  public groupsOrderChange(value: FsGalleryItem[], reorder = false): void {
    if (this.config.group.groupsReorderEnd) {
      const reorderEndData = value.filter((val) => !val.locked);

      this.config.group.groupsReorderEnd(reorderEndData);
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
}
