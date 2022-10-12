import { Component, HostListener, OnInit, OnDestroy, Inject, Renderer2, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';

import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { PREVIEW_DATA } from '../../injectors/preview-data';
import { FsGalleryPreviewRef } from '../../classes/gallery-preview-ref';
import { MimeType } from '../../enums';
import { GalleryConfig } from '../../classes';


@Component({
  templateUrl: './gallery-preview.component.html',
  styleUrls: ['./gallery-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryPreviewComponent implements OnInit, OnDestroy {

  @ViewChild(MatDrawer, { static: true })
  public drawer: MatDrawer;

  @HostBinding('class.carousel') public classCarousel = false;

  @HostListener('document:keydown', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 27:
        this._previewRef.close();
        break;
      case 37:
        this.prevItem();
        break;
      case 39:
        this.nextItem();
        break;
    }
  }

  public availableImages: FsGalleryItem[];
  public imageHover = false;
  public MimeType = MimeType;
  public hasManyItems = false;
  public drawerShow = true;
  public activeItem: FsGalleryItem;
  public activeImage: { height: number, width: number };
  public drawerMode: any = 'side';
  public activeImageIndex = 0;

  private _destroy$ = new Subject();

  constructor(
    @Inject(PREVIEW_DATA) private _item: FsGalleryItem,
    public galleryService: FsGalleryService,
    public renderer: Renderer2,
    private _router: Router,
    private _previewRef: FsGalleryPreviewRef,
    private _breakpointObserver: BreakpointObserver,
    private _cdRef: ChangeDetectorRef,
    private _el: ElementRef,
  ) { }

  public ngOnInit(): void {
    this._initAvailableImages();
    this.setActiveItem(this._item);
    this.classCarousel = this.galleryConfig.showCarousel;
    this.drawer.opened = this.galleryConfig.details.autoOpen;

    this._router.events
      .pipe(
        takeUntil(this._destroy$),
        filter(event => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
        this._previewRef.close();
      });

    this._breakpointObserver
      .observe(['(min-width: 800px)'])
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.drawerMode = 'side';
        } else {
          this.drawerMode = 'over';
        }

        this._cdRef.markForCheck();
      });

    this.renderer.addClass(document.body, 'fs-gallery-preview-open');
  }

  public get galleryConfig(): GalleryConfig {
    return this.galleryService.config;
  }

  public get hasPrevItem(): boolean {
    return this.activeImageIndex > 0;
  }

  public get hasNextItem(): boolean {
    return this.activeImageIndex < (this.availableImages.length - 1);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this.renderer.removeClass(document.body, 'fs-gallery-preview-open');
  }

  public close() {
    this._previewRef.close();
  }

  public detailsToggled() {
    this.drawer.opened = !this.drawer.opened;
  }

  public imageLoad(event) {
    this.activeImage = {
      height: event.target.naturalHeight,
      width: event.target.naturalWidth,
    };
  }

  public prevItem() {
    const item = this.availableImages[this.activeImageIndex - 1];
    if (item) {
      this.setActiveItem(item);
    }
  }

  public nextItem() {
    const item = this.availableImages[this.activeImageIndex + 1];
    if (item) {
      this.setActiveItem(item);
    }
  }

  public setActiveItem(item: FsGalleryItem) {
    this.activeItem = item;
    this.activeImageIndex = this.availableImages.indexOf(item);

    setTimeout(() => {
      const el = this._el.nativeElement.querySelector(`fs-gallery-preview-carousel [data-index='${this.activeImageIndex}']`);
      el?.scrollIntoView({ block: 'center', inline: 'center' });
    });
  }

  private _initAvailableImages() {
    this.availableImages = this.galleryService.data$.getValue()
      .filter((item: FsGalleryItem) => {
        return !item.folder;
      });


    this.hasManyItems = this.availableImages.length > 1;
  }

}
