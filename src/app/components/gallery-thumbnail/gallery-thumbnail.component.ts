import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostBinding } from '@angular/core';

import { Subject } from 'rxjs';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { GalleryLayout } from '../../enums/gallery-layout-enum';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'fs-gallery-thumbnail',
  templateUrl: './gallery-thumbnail.component.html',
  styleUrls: [ './gallery-thumbnail.component.scss' ]
})
export class FsGalleryThumbnailComponent {

  @Input() public data: FsGalleryItem = null;
  @Output() public select = new EventEmitter();

  public galleryLayout = GalleryLayout;

  private _destroy$ = new Subject<void>();

  constructor(
    public galleryService: FsGalleryService,
  ) { }
}
