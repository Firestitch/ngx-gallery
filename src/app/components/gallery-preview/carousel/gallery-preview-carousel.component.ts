import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output,
} from '@angular/core';

import { MimeType } from '../../../enums';
import { FsGalleryItem } from '../../../interfaces';


@Component({
  selector: 'fs-gallery-preview-carousel',
  templateUrl: './gallery-preview-carousel.component.html',
  styleUrls: ['./gallery-preview-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryPreviewCarouselComponent {

  @Input() public items: FsGalleryItem[];
  @Input() public activeItem: FsGalleryItem;

  @Output() public activeItemChanged = new EventEmitter<FsGalleryItem>();

  public MimeType = MimeType;

  constructor(
    private _el: ElementRef,
  ) { }

  public itemClick(item) {
    this.activeItem = item;
    this.activeItemChanged.emit(item);
  }

  public loaded() {
    const el = this._el.nativeElement.querySelector('.active');
    el?.scrollIntoView({ block: 'center', inline: 'center' });
  }

}
