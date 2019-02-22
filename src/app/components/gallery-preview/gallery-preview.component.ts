import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryPreviewService } from '../../services/gallery-preview.service';
import { FsGalleryDataItem } from '../../interfaces/gallery-data-item';


@Component({
  selector: 'fs-gallery-preview',
  templateUrl: './gallery-preview.component.html',
  styleUrls: [ './gallery-preview.component.scss' ]
})
export class FsGalleryPreviewComponent implements OnInit, OnDestroy {

  public data: FsGalleryDataItem = null;

  public image: string = null;

  public imageHover = false;

  private _destroy$ = new Subject();

  constructor(
    private fsGalleryPreviewService: FsGalleryPreviewService,
    public fsGalleryService: FsGalleryService
  ) { }

  ngOnInit() {
    this.fsGalleryPreviewService.data$
      .pipe(
        takeUntil(this._destroy$)
      )
      .subscribe((data: FsGalleryDataItem) => {
        this.data = data;
        this.image = this.fsGalleryService.getPreviewImage(this.data);
      });
  }

  close($event) {
    this.fsGalleryPreviewService.close();
  }

  prev() {
    this.fsGalleryPreviewService.prev();
  }

  next() {
    this.fsGalleryPreviewService.next();
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
        this.fsGalleryPreviewService.close();
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

}
