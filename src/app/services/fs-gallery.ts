import { Location } from '@angular/common';
import { Injectable, Injector, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Overlay } from '@angular/cdk/overlay';

import { FsStore } from '@firestitch/store';

import { take } from 'rxjs/operators';

import { FsGalleryPreviewDetailsDirective } from '../directives';
import { FsGalleryConfig, FsGalleryItem } from '../interfaces';

import { FsGalleryService } from './gallery.service';


@Injectable({
  providedIn: 'root',
})
export class FsGallery {
  private _injector = inject(Injector);
  private _overlay = inject(Overlay);
  private _location = inject(Location);
  private _store = inject(FsStore);
  private _route = inject(ActivatedRoute);


  public openPreview(item: FsGalleryItem, options?: GalleryOptions) {
    this.openPreviews([item], options);
  }

  public openPreviews(items: FsGalleryItem[], options?: GalleryOptions) {
    const galleryService = new FsGalleryService();
    galleryService.data = items;
    galleryService.previewDetails = options?.previewDetails;

    if (options?.config) {
      galleryService.config = options.config;
    }

    galleryService.openPreview(galleryService.data[0])
      .onClose
      .pipe(
        take(1),
      )
      .subscribe();
  }
}


interface GalleryOptions {
  previewDetails?: FsGalleryPreviewDetailsDirective,
  config?: FsGalleryConfig
}
