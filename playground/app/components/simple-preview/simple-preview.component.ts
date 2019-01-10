import { Component } from '@angular/core';

import { FsGalleryConfig } from '../../../../src';


@Component({
  selector: 'simple-preview',
  templateUrl: './simple-preview.component.html',
  styleUrls: ['./simple-preview.component.css']
})
export class SimplePreviewComponent {

  public config: FsGalleryConfig = { draggable: false, overwriteThumbnailTemplate: true, showCarousel: false };

  public items: object[] = [
    {
      id: 1,
      description: 'Image 1 description',
      image: 'https://loremflickr.com/1600/800?random=1'
    }
  ]

}
