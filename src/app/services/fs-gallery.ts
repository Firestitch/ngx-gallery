import { Location } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Overlay } from '@angular/cdk/overlay';

import { FsStore } from '@firestitch/store';

import { take } from 'rxjs/operators';

import { DragulaService } from 'ng2-dragula';

import { PersistanceController } from '../classes';
import { FsGalleryPreviewComponent } from '../components';
import { FsGalleryPreviewDetailsDirective } from '../directives';
import { FsGalleryConfig, FsGalleryItem } from '../interfaces';

import { FsGalleryService } from './gallery.service';


@Injectable({
  providedIn: 'root',
})
export class FsGallery {

  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
    private _location: Location,
    private _dragulaService: DragulaService,
    private _store: FsStore,
    private _route: ActivatedRoute,
  ) {
  }

  public openPreview(item: FsGalleryItem, options?: GalleryOptions) {
    this.openPreviews([item], options);
  }

  public openPreviews(items: FsGalleryItem[], options?: GalleryOptions) {
    const persistanceController = new PersistanceController(this._store, this._route);

    const galleryService = new FsGalleryService(FsGalleryPreviewComponent, this._overlay, this._injector, this._location, this._dragulaService, persistanceController);
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
