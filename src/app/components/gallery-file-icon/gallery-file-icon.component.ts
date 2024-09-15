import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MimeType } from '../../enums';
import { FsGalleryItem } from '../../interfaces';


@Component({
  selector: 'fs-gallery-file-icon',
  templateUrl: './gallery-file-icon.component.html',
  styleUrls: ['./gallery-file-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryFileIconComponent implements OnChanges {

  @Input() public item: FsGalleryItem;
  @Input() public width = 80;
  @Input() public height;

  public MimeType = MimeType;
  public darkColor;
  public color: string;
  public fontSize;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.color = this.item.mime.color || '#cccccc';
      this.darkColor = this.hue(this.color, -30);
    }

    if (changes.width && this.width) {
      this.fontSize = this.width * .2;
    }

    if (changes.height && this.height) {
      this.fontSize = this.height * .15;
    }
  }

  public hue(hex, percent: number) {
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length === 3) {
      hex = hex.replace(/(.)/g, '$1$1');
    }

    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    const calculatedPercent = (100 + percent) / 100;

    r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
    g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
    b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

    return `#${r.toString(16).toUpperCase()}${g.toString(16).toUpperCase()}${b
      .toString(16)
      .toUpperCase()}`;
  }

}
