import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef, ViewChild, inject } from '@angular/core';

import { FilterComponent } from '@firestitch/filter';

import { Subject } from 'rxjs';

import { GalleryConfig, PersistanceController } from '../../classes';
import { FsGalleryNavDirective, FsGalleryPreviewDetailsDirective } from '../../directives';
import { FsGalleryListColumnDirective } from '../../directives/column.directive';
import { FsGalleryEmptyStateDirective } from '../../directives/empty-state.directive';
import { FsGalleryPreviewDirective } from '../../directives/gallery-preview.directive';
import { FsGalleryThumbnailPreviewDirective } from '../../directives/gallery-thumbnail-preview.directive';
import { FsGalleryThumbnailDirective } from '../../directives/gallery-thumbnail.directive';
import { GalleryPreviewComponentInjector } from '../../injectors';
import { FsGalleryConfig, FsGalleryItem } from '../../interfaces';
import { FsGalleryService } from '../../services';
import { FsGalleryPreviewComponent } from '../gallery-preview';

import { GalleryView } from './../../enums';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { FsGalleryNavComponent } from '../gallery-nav/gallery-nav.component';
import { FsGalleryListViewComponent } from '../list-view/list-view.component';
import { FsGalleryViewComponent } from '../gallery-view/gallery-view.component';


@Component({
    selector: 'fs-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
    providers: [
        FsGalleryService,
        PersistanceController,
        {
            provide: GalleryPreviewComponentInjector,
            useValue: FsGalleryPreviewComponent,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FilterComponent,
        NgClass,
        NgTemplateOutlet,
        FsGalleryNavComponent,
        FsGalleryListViewComponent,
        FsGalleryViewComponent,
        AsyncPipe,
    ],
})
export class FsGalleryComponent implements OnInit, OnDestroy, AfterContentInit {
  galleryService = inject(FsGalleryService);


  @Output()
  public zoomChanged = new EventEmitter();

  @Input()
  public set config(config: FsGalleryConfig) {
    this.galleryService.config = config;
    this._config = this.galleryService.config;
  }

  @ContentChild(FsGalleryPreviewDirective, { read: TemplateRef })
  public previewTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryNavDirective, { read: TemplateRef })
  public navTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryPreviewDetailsDirective)
  public previewDetails: FsGalleryPreviewDetailsDirective;

  @ContentChild(FsGalleryThumbnailDirective, { read: TemplateRef })
  public thumbnailTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryThumbnailPreviewDirective, { read: TemplateRef })
  public thumbnailPreviewTemplate: TemplateRef<any> = null;

  @ContentChild(FsGalleryEmptyStateDirective, { read: TemplateRef })
  public emptyStateTemplate: TemplateRef<any> = null;

  @ViewChild(FilterComponent, { static: true })
  public filter: FilterComponent;

  public reorderEnabled = true;
  public GalleryView = GalleryView;

  @ContentChildren(FsGalleryListColumnDirective)
  private _listColumnDirectives: QueryList<FsGalleryListColumnDirective>;

  private _config: GalleryConfig = null;
  private _destroy$ = new Subject<void>();

  public ngOnInit() {
    this.galleryService.setFilter(this.filter);
    this.reorderEnabled = this.galleryService.config.reorderEnabled;
  }

  public navClick(item) {
    const index = this.galleryService.navItems.indexOf(item);
    this.galleryService.navItems = index === -1 ? [] : this.galleryService.navItems.splice(index);
    this.galleryService.loadGallery();
  }

  public ngAfterContentInit() {
    this.galleryService.previewTemplate = this.previewTemplate;
    this.galleryService.thumbnailTemplate = this.thumbnailTemplate;
    this.galleryService.previewDetails = this.previewDetails;
    this.galleryService.thumbnailPreviewTemplate = this.thumbnailPreviewTemplate;
    this.galleryService.emptyStateTemplate = this.emptyStateTemplate;
    this.galleryService.setListColumns(this._listColumnDirectives.toArray());
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public updateItemData(itemData, data) {
    this.galleryService.updateItemData(itemData, data);
  }

  public orderChange(value: FsGalleryItem[]): void {
    this.galleryService.data = value;
    this._config.reorderEnd(value);
  }

  public get hasFilter() {
    if (!this.galleryService.filterConfig) {
      return false;
    }

    const actions = this.galleryService.filterConfig.actions
      .some((action) => {
        return !action.show || action.show();
      });

    const items = this.galleryService.filterConfig.items
      .some((item) => {
        return !item.hide;
      });

    return actions || items;
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
