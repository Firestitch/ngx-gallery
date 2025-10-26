import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FsGalleryItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services/gallery.service';
import { NgTemplateOutlet } from '@angular/common';
import { FsLabelModule } from '@firestitch/label';


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

}
