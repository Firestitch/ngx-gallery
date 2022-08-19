import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FsGalleryItem, Mime } from '../../interfaces';
import { MimeType } from '../../enums';


@Component({
  selector: 'fs-gallery-file-icon',
  templateUrl: './gallery-file-icon.component.html',
  styleUrls: ['./gallery-file-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryFileIconComponent implements OnInit {

  public MimeType = MimeType;
  public darkColor;

  @Input() public item: FsGalleryItem;
  @Input() public color: string;
  @Input() public width = 100;

  public ngOnInit(): void {
    this.color = this.item.mime.color || '#cccccc';
    this.darkColor = this.hue(this.color, -50);
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
