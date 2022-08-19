import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FsGalleryItem } from '../../interfaces';
import { MimeType } from '../../enums';

@Component({
  selector: 'fs-gallery-icon',
  templateUrl: './gallery-icon.component.html',
  styleUrls: ['./gallery-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryIconComponent {

  @Input() public item: FsGalleryItem = null;

  public MimeType = MimeType;
}
