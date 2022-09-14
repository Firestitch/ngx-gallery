import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';

import { FsGalleryItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services/gallery.service';


@Component({
  selector: 'fs-gallery-preview-header',
  templateUrl: './gallery-preview-header.component.html',
  styleUrls: ['./gallery-preview-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryPreviewHeaderComponent {

  @Input() public item: FsGalleryItem;
  @Input() public galleryService: FsGalleryService;

  @Output() public previewClosed = new EventEmitter<void>();
  @Output() public detailsToggled = new EventEmitter<void>();

}
