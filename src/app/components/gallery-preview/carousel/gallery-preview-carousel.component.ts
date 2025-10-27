import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core';

import { MimeType } from '../../../enums';
import { FsGalleryItem } from '../../../interfaces';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FsGalleryFileIconComponent } from '../../gallery-file-icon/gallery-file-icon.component';
import { ImageSrcPipe } from '../../../pipes/image-src.pipe';


@Component({
    selector: 'fs-gallery-preview-carousel',
    templateUrl: './gallery-preview-carousel.component.html',
    styleUrls: ['./gallery-preview-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        MatProgressSpinner,
        NgTemplateOutlet,
        FsGalleryFileIconComponent,
        AsyncPipe,
        ImageSrcPipe,
    ],
})
export class FsGalleryPreviewCarouselComponent {
  private _el = inject(ElementRef);


  @Input() public items: FsGalleryItem[];
  @Input() public activeItem: FsGalleryItem;

  @Output() public activeItemChanged = new EventEmitter<FsGalleryItem>();

  public MimeType = MimeType;

  public itemClick(item) {
    this.activeItem = item;
    this.activeItemChanged.emit(item);
  }

  public loaded() {
    const el = this._el.nativeElement.querySelector('.active');
    el?.scrollIntoView({ block: 'center', inline: 'center' });
  }

}
