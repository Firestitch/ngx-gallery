import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { FsGalleryConfig, FsGalleryItem, FsGalleryPreviewDetailsDirective } from '@firestitch/gallery';

import { of } from 'rxjs';

import { FsGallery } from 'src/app/services/fs-gallery';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {

  @ViewChild(FsGalleryPreviewDetailsDirective)
  public previewDetails: FsGalleryPreviewDetailsDirective;

  public config: FsGalleryConfig = {
    draggable: false,
    showCarousel: false,
    map: (data) => {
      return {
        url: data.image,
        preview: data.image,
      };
    },
    zoom: false,
    fetch: (query) => {
      return of(this.items);
    },
  };

  public items: FsGalleryItem[] = [
    {
      preview: 'https://img.freepik.com/premium-photo/cute-dachshund-puppy-hand-mistress_414160-1577.jpg',
      url: 'https://img.freepik.com/premium-photo/cute-dachshund-puppy-hand-mistress_414160-1577.jpg?w=1800',
      guid: 'dog-1',
    },
    {
      url: 'https://img.freepik.com/premium-photo/puppy-breed-dachshund-brown-color_98725-768.jpg?w=1800',
      preview: 'https://img.freepik.com/premium-photo/puppy-breed-dachshund-brown-color_98725-768.jpg',
      guid: 'dog-1',
    },
  ];

  constructor(
    private gallery: FsGallery,
  ) { }

  public open(): void {
    this.gallery.openPreviews(this.items, {
      previewDetails: this.previewDetails,
      config: {
        details: {
          autoOpen: true,
        },
      },
    });
  }

}
