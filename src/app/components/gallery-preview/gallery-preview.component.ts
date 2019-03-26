import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryPreviewService } from '../../services/gallery-preview.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery-preview',
  templateUrl: './gallery-preview.component.html',
  styleUrls: [ './gallery-preview.component.scss' ]
})
export class FsGalleryPreviewComponent implements OnInit, OnDestroy {

  public data: FsGalleryItem = null;
  public image: string = null;
  public imageHover = false;

  public hasManyItems = false;

  private _destroy$ = new Subject();

  constructor(
    public galleryService: FsGalleryService,
    private galleryPreviewService: FsGalleryPreviewService,
  ) { }

  ngOnInit() {
    this._subscribeToGalleryData();
    this._subscribeToPreviewData();
  }

  close($event) {
    this.galleryPreviewService.close();
  }

  prev() {
    this.galleryPreviewService.prev();
  }

  next() {
    this.galleryPreviewService.next();
  }

  imageClick($event) {
    const cursorX = $event.clientX;
    const imageWidth = $event.target.width;
    const windowWidth = $event.view.innerWidth;
    if (cursorX <= (windowWidth / 2)) {
      this.prev();
    } else {
      this.next();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 27:
        this.galleryPreviewService.close();
        break;
      case 37:
        this.prev();
        break;
      case 39:
        this.next();
        break;
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _subscribeToGalleryData() {
    this.galleryService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((data: FsGalleryItem[]) => {
        this.hasManyItems = data.length > 1;
      });
  }

  private _subscribeToPreviewData() {
    this.galleryPreviewService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((data: FsGalleryItem) => {
        this.data = data;
        this.image = this.galleryService.getPreviewImage(this.data);
      });
  }

}
