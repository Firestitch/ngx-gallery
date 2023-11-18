import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { MatDrawer } from '@angular/material/sidenav';

import { Observable, Subject, of } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SafeUrl } from '@angular/platform-browser';
import { FsApiFile } from '@firestitch/api';
import { GalleryConfig } from '../../classes';
import { FsGalleryPreviewRef } from '../../classes/gallery-preview-ref';
import { MimeType } from '../../enums';
import { PREVIEW_DATA } from '../../injectors/preview-data';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { FsGalleryService } from '../../services/gallery.service';


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
  public hasMultipleItems = false;
  public drawerShow = true;
  public activeItem: FsGalleryItem;
  public activeImage: { height: number, width: number };
  public drawerMode: any = 'side';
  public activeImageIndex = 0;
  public imageUrl$: Observable<string | SafeUrl>;

  private _destroy$ = new Subject();

  constructor(
    @Inject(PREVIEW_DATA) private _item: FsGalleryItem,
    public galleryService: FsGalleryService,
    public renderer: Renderer2,
    private _router: Router,
    private _previewRef: FsGalleryPreviewRef,
    private _el: ElementRef,
  ) { }

  public ngOnInit(): void {
    this._initAvailableImages();
    this.setActiveItem(this._item);
    this.classCarousel = this.galleryConfig.showCarousel;
    this.drawer.opened = window.innerWidth > 600 && this.galleryConfig.details.autoOpen;

    this._router.events
      .pipe(
        takeUntil(this._destroy$),
        filter(event => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
        this._previewRef.close();
      });
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
    } else {
      this.setActiveItem(this.availableImages[this.availableImages.length - 1]);
    }
  }

  public nextItem() {
    const item = this.availableImages[this.activeImageIndex + 1];
    if (item) {
      this.setActiveItem(item);
    } else {
      this.setActiveItem(this.availableImages[0]);
    }
  }

  public setActiveItem(item: FsGalleryItem) {
    this.activeItem = item;
    this.activeImageIndex = this.availableImages
      .findIndex((item) => this.activeItem?.guid === item.guid);

    this.imageUrl$ = this.activeItem.url instanceof FsApiFile ?
      this.activeItem.url.safeBase64Url :
      of(this.activeItem.url);

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


    this.hasMultipleItems = this.availableImages.length > 1;
  }

}
