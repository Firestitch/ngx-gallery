import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';

import { MimeType } from '../../../enums';
import { FsGalleryItem } from '../../../interfaces';
import { FsGalleryService } from '../../../services';
import { FsGalleryIconComponent } from '../../gallery-icon/gallery-icon.component';


@Component({
    selector: 'fs-gallery-thumbnail-info',
    templateUrl: './gallery-thumbnail-info.component.html',
    styleUrls: ['./gallery-thumbnail-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsGalleryIconComponent],
})
export class FsGalleryThumbnailInfoComponent implements OnInit {
  galleryService = inject(FsGalleryService);


  @Input() public item: FsGalleryItem;
  @Input() public hasInfo = false;
  @Input() public showIcon;
  @Input() public name;

  @Output() public hasInfoChange = new EventEmitter();

  public MimeType = MimeType;

  public ngOnInit(): void {
    if (this.showIcon === undefined) {
      this.showIcon = this.galleryService.config.info.icon;
    }

    if (this.name === undefined) {
      this.name = this.galleryService.getInfoItemName(this.item);
    }
  }

  public select(action, file) {
    action.select(this.item, file);
  }

  public menuClick(event, action, data) {
    if (action.click) {
      action.click(data);
    }
  }

}
