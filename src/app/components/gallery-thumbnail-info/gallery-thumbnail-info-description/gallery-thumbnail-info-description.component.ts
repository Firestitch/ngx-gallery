import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { FsGalleryItem } from '../../../interfaces';
import { MimeType } from '../../../enums';


@Component({
  selector: 'fs-gallery-thumbnail-info-description',
  templateUrl: './gallery-thumbnail-info-description.component.html',
  styleUrls: ['./gallery-thumbnail-info-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryThumbnailInfoDescriptionComponent implements OnInit {

  @Input() public item: FsGalleryItem = null;

  public MimeType = MimeType;
  public description;

  public ngOnInit(): void {
    if (this.item.folder) {
      if (this.item.items) {
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

}
