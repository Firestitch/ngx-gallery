import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FsLabelModule } from '@firestitch/label';

import { FsGalleryItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services/gallery.service';


@Component({
  selector: 'fs-gallery-preview-details',
  templateUrl: './gallery-preview-details.component.html',
  styleUrls: ['./gallery-preview-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgTemplateOutlet, FsLabelModule],
})
export class FsGalleryPreviewDetailsComponent {

  @Input() public item: FsGalleryItem;
  @Input() public galleryService: FsGalleryService;
  @Input() public image: { height: number, width: number };

  public get width(): number {
    const details = this.galleryService.config.details;

    return (typeof details === 'object' && details.width) || 300;
  }

}
