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
  ChangeDetectionStrategy,
} from '@angular/core';

import { FilterComponent } from '@firestitch/filter';

import { BehaviorSubject, Subject } from 'rxjs';

import { FsGalleryService } from '../../services';
import { GalleryView } from './../../enums';
import { PersistanceController, GalleryConfig } from '../../classes';
import { FsGalleryItem, FsGalleryConfig } from '../../interfaces';
import { FsGalleryThumbnailPreviewDirective } from '../../directives/gallery-thumbnail-preview.directive';
import { FsGalleryPreviewDirective } from '../../directives/gallery-preview.directive';
import { FsGalleryThumbnailDirective } from '../../directives/gallery-thumbnail.directive';
import { FsGalleryListColumnDirective } from '../../directives/column.directive';
import { FsGalleryNavDirective, FsGalleryPreviewDetailsDirective } from '../../directives';
import { FsGalleryPreviewComponent } from '../gallery-preview';
import { GalleryPreviewComponentInjector } from '../../injectors';


@Component({
  selector: 'fs-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  providers: [
    FsGalleryService,
    PersistanceController,
    {
      provide: GalleryPreviewComponentInjector,
      useValue: FsGalleryPreviewComponent
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryComponent implements OnInit, OnDestroy, AfterContentInit {

  @Output() zoomChanged = new EventEmitter();

  @Input() set config(value: FsGalleryConfig) {
    this._config = new GalleryConfig(value);
    this.galleryService.config = this._config;
  }

  @ContentChild(FsGalleryPreviewDirective, { read: TemplateRef })
  public previewTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryNavDirective, { read: TemplateRef })
  public navTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryPreviewDetailsDirective, { read: TemplateRef })
  public detailsTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryThumbnailDirective, { read: TemplateRef })
  public thumbnailTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryThumbnailPreviewDirective, { read: TemplateRef })
  public thumbnailPreviewTemplate: TemplateRef<any> = null;

  @ViewChild(FilterComponent, { static: true })
  public filter: FilterComponent;

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
    this.galleryService.setFilter(this.filter);
    this.data$ = this.galleryService.data$;
    this.reorderEnabled = this.galleryService.config.reorderable;
  }

  public navClick(item) {
    const index = this.galleryService.navItems.indexOf(item);
    this.galleryService.navItems = index === -1 ? [] : this.galleryService.navItems.splice(index);
    this.galleryService.loadGallery();
  }

  public ngAfterContentInit() {
    this.galleryService.previewTemplate = this.previewTemplate;
    this.galleryService.thumbnailTemplate = this.thumbnailTemplate;
    this.galleryService.detailsTemplate = this.detailsTemplate;
    this.galleryService.thumbnailPreviewTemplate = this.thumbnailPreviewTemplate;
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

  public filterReady() {
    this.galleryService.filtersReady$.next();
  }

}
