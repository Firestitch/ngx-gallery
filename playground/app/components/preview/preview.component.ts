import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';

import { FsGalleryConfig, FsGalleryItem, FsGalleryPreviewDetailsDirective } from '@firestitch/gallery';

import { of } from 'rxjs';

import { FsGallery } from 'src/app/services/fs-gallery';
import { MatAnchor } from '@angular/material/button';
import { FsGalleryPreviewDetailsDirective as FsGalleryPreviewDetailsDirective_1 } from '../../../../src/app/directives/gallery-preview-details.directive';
import { NgTemplateOutlet, JsonPipe } from '@angular/common';


@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatAnchor,
        FsGalleryPreviewDetailsDirective_1,
        NgTemplateOutlet,
        JsonPipe,
    ],
})
export class PreviewComponent {
  private gallery = inject(FsGallery);


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
