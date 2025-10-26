import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { FsGalleryItem } from '../../../interfaces';
import { MimeType } from '../../../enums';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
    selector: 'fs-gallery-folder-icon-info',
    templateUrl: './gallery-folder-icon-info.component.html',
    styleUrls: ['./gallery-folder-icon-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatTooltip],
})
export class FsGalleryFolderIconInfoComponent implements OnInit {

  @Input() public item: FsGalleryItem = null;

  public MimeType = MimeType;
  public description;
  public count;

  public ngOnInit(): void {
    this.count = this.item.contains.files + this.item.contains.folders;
    if (this.count) {
      const parts = [];
      const images = this.item.contains.mimeTypes[MimeType.Image];
      if (images) {
        parts.push(`${images} ${(images === 1 ? 'image' : 'images')}`);
      }

      const videos = this.item.contains.mimeTypes[MimeType.Video];
      if (videos) {
        parts.push(`${videos} ${(videos === 1 ? 'video' : 'videos')}`);
      }

      const files = this.item.contains.files;
      if (files) {
        parts.push(`${files} ${(files === 1 ? 'file' : 'files')}`);
      }

      this.description = parts.join(' ,');
    } else {
      this.description = 'Empty Folder';
    }
  }

}
