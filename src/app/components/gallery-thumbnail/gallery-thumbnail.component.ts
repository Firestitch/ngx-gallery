import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { GalleryLayout } from '../../enums/gallery-layout-enum';

@Component({
  selector: 'fs-gallery-thumbnail',
  templateUrl: './gallery-thumbnail.component.html',
  styleUrls: [ './gallery-thumbnail.component.scss' ]
})
export class FsGalleryThumbnailComponent implements OnInit, OnDestroy {

  @Input() public data: FsGalleryItem = null;
  @Input() public carousel = false;
  @Input() public overwriteThumbnailTemplate = false;
  @Input() set activeItem(item: FsGalleryItem) {
    this.isActive = this.data === item;
  }
  @Output() public select = new EventEmitter<FsGalleryItem>();

  public image: string = null;
  public styles = {
    width: null,
    height: null,
  };

  public isActive = false;
  public galleryLayout = GalleryLayout;

  private _destroy$ = new Subject();

  constructor(
    public fsGalleryService: FsGalleryService,
  ) { }

  public ngOnInit() {
    this.image = this.fsGalleryService.getThumbnailImage(this.data);

    if (!this.carousel) {
      this.fsGalleryService.dimentionsChange$.subscribe(() => {
        this.styles.width = this.fsGalleryService.imageWidth + 'px';
        this.styles.height = this.fsGalleryService.imageHeight + 'px';
      });

      this.fsGalleryService.updateImageDims();
    }
  }

  public onSelect() {
    this.select.emit(this.data);
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public preventEventPropagation(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  public menuClick(event, action, data) {
    action.click(data);
  }
}
