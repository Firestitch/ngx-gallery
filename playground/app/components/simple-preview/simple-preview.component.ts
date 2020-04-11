import { Component } from '@angular/core';

import { FsGalleryConfig } from '@firestitch/gallery';
import { of } from 'rxjs';


@Component({
  selector: 'simple-preview',
  templateUrl: './simple-preview.component.html',
  styleUrls: ['./simple-preview.component.css']
})
export class SimplePreviewComponent {

  public config: FsGalleryConfig = {
    draggable: false,
    showCarousel: false,
    map: (data) => {
      return {
        url: data.image,
        preview: data.image
      }
    },
    zoom: false,
    fetch: (query) => {
      return of(this.items);
    }
  };

  public items: any[] = [
    {
      id: 1,
      description: 'Image 1 description',
      image: 'https://loremflickr.com/1600/800?random=1'
    }
  ]

}
