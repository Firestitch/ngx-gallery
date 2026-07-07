import { Location } from '@angular/common';
import { Injectable, Injector, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Overlay } from '@angular/cdk/overlay';

import { FsStore } from '@firestitch/store';

import { take } from 'rxjs/operators';

import { FsGalleryPreviewRef, PersistanceController } from '../classes';
import { FsGalleryPreviewComponent } from '../components';
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


  public openPreview(item: FsGalleryItem, options?: GalleryOptions): FsGalleryPreviewRef {
    return this.openPreviews([item], options);
  }

  public openPreviews(items: FsGalleryItem[], options?: GalleryOptions): FsGalleryPreviewRef {
    const persistanceController = new PersistanceController(this._store, this._route);

    const galleryService = new FsGalleryService(FsGalleryPreviewComponent, this._overlay, this._injector, this._location, persistanceController);
    galleryService.data = items;
    galleryService.previewDetails = options?.previewDetails;

    if (options?.config) {
      galleryService.config = options.config;
    }

    const previewRef = galleryService.openPreview(galleryService.data[0]);

    previewRef.onClose
      .pipe(
        take(1),
      )
      .subscribe();

    return previewRef;
  }
}


interface GalleryOptions {
  previewDetails?: FsGalleryPreviewDetailsDirective,
  config?: FsGalleryConfig
}
