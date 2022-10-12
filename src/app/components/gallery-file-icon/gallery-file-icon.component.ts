import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FsGalleryItem } from '../../interfaces';
import { MimeType } from '../../enums';


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
  public fontSize

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.color = this.item.mime.color || '#cccccc';
      this.darkColor = this.hue(this.color, -50);
    }

    if (changes.width) {
      this.fontSize = this.width * .2;
    }

    if (changes.height) {
      this.fontSize = this.height * .15;
    }
  }

  public hue(col, amt) {
    col = col.replace(/^#/, '');
    const num = parseInt(col, 16);
    const r = (num >> 16) + amt;
    const b = ((num >> 8) & 0x00FF) + amt;
    const g = (num & 0x0000FF) + amt;
    const newColor = g | (b << 8) | (r << 16);
    return `#${newColor.toString(16)}`;
  }

}
