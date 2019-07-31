import { Component } from '@angular/core';

import { FsGalleryConfig } from '@firestitch/gallery';
import { of } from 'rxjs';
import { FsGalleryItem } from '../../../../src/app/interfaces/gallery-config.interface';


@Component({
  selector: 'simple-preview',
  templateUrl: './simple-preview.component.html',
  styleUrls: ['./simple-preview.component.css']
})
export class SimplePreviewComponent {

  public config: FsGalleryConfig = {
    draggable: false,
    showCarousel: false,
    zoom: false,
    fetch: (query) => {
      return of(this.items);
    }
  };

  public items: FsGalleryItem[] = [
    {
      id: 1,
      description: 'Image 1 description',
      image: 'https://loremflickr.com/1600/800?random=1'
    }
  ]

}
