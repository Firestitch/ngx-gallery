import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';

import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';


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

  public imageUrl$: Observable<string | SafeUrl>;
  public availableImages: FsGalleryItem[];
  public imageHover = false;
  public MimeType = MimeType;
  public hasMultipleItems = false;
  public drawerShow = true;
  public activeItem: FsGalleryItem;
  public activeImage: { height: number, width: number };
  public drawerMode: any = 'side';
  public activeImageIndex = 0;
  public validUrl = true;

  private _destroy$ = new Subject();
  private _disableCloses = {};

  constructor(
    @Inject(PREVIEW_DATA) private _item: FsGalleryItem,
    public galleryService: FsGalleryService,
    public renderer: Renderer2,
    private _router: Router,
    private _previewRef: FsGalleryPreviewRef,
    private _el: ElementRef,
    private _dialog: MatDialog,
  ) { }

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

  public ngOnInit(): void {
    this.setActiveItem(this._item);
    this._disableDialogEscapeClose();
    this._initAvailableImages();
    this._initDataChanges();    
    this.classCarousel = this.galleryConfig.showCarousel;
    this.drawer.opened = window.innerWidth > 600 && this.galleryConfig.details.autoOpen;

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
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
    this._enableDialogEscapeClose();
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public close() {
    this._previewRef.close();
  }

  public detailsToggled() {
    this.drawer.opened = !this.drawer.opened;
  }

  public imageError() {
    this.validUrl = false;
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

  public setActiveItem(galleryItem: FsGalleryItem) {
    this.validUrl = true;
    this.activeItem = {
      ...galleryItem,
    };

    this.activeImageIndex = this.availableImages
      .findIndex((item) => this.activeItem?.guid === item.guid);

    setTimeout(() => {
      const el = this._el.nativeElement
        .querySelector(`fs-gallery-preview-carousel [data-index='${this.activeImageIndex}']`);
      el?.scrollIntoView({ block: 'center', inline: 'center' });
    });
  }

  private _disableDialogEscapeClose() {
    this._dialog.openDialogs
      .forEach((dialog) => {
        this._disableCloses = {
          ...this._disableCloses,
          [dialog.id]: dialog.disableClose,
        };

        dialog.disableClose = true;
      });
  }

  private _enableDialogEscapeClose() {
    this._dialog.openDialogs
      .forEach((dialog) => {
        dialog.disableClose = this._disableCloses[dialog.id];
      });
  }

  private _initAvailableImages() {
    this.availableImages = this.galleryService.data
      .filter((item: FsGalleryItem) => {
        return !item.folder;
      });


    this.hasMultipleItems = this.availableImages.length > 1;
  }

  private _initDataChanges() {
    this.galleryService.data$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        const activeItem = data
          .find((item) => item.guid === this.activeItem?.guid);

        this.setActiveItem(activeItem);
      });
  }
}
