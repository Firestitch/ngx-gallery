import { Component } from '@angular/core';

import { FsGalleryConfig } from '@firestitch/gallery';
import { of } from 'rxjs';
import { FsGalleryComponent } from '../../../../src/app/components/gallery/gallery.component';
import { FsGalleryThumbnailDirective } from '../../../../src/app/directives/gallery-thumbnail.directive';
import { FsGalleryPreviewDirective } from '../../../../src/app/directives/gallery-preview.directive';


@Component({
    selector: 'simple-preview',
    templateUrl: './simple-preview.component.html',
    styleUrls: ['./simple-preview.component.css'],
    standalone: true,
    imports: [FsGalleryComponent, FsGalleryThumbnailDirective, FsGalleryPreviewDirective]
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
