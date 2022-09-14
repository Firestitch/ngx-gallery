import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';

import { FsGalleryItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services/gallery.service';


@Component({
  selector: 'fs-gallery-preview-details',
  templateUrl: './gallery-preview-details.component.html',
  styleUrls: ['./gallery-preview-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryPreviewDetailsComponent {

  @Input() public item: FsGalleryItem;
  @Input() public galleryService: FsGalleryService;
  @Input() public image: { height: number, width: number };

  @Output() public detailsToggled = new EventEmitter<void>();

}
