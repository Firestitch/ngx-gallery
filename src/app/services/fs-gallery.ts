import { Overlay } from '@angular/cdk/overlay';
import { Injectable, Injector } from '@angular/core';

import { take } from 'rxjs/operators';

import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FsStore } from '@firestitch/store';
import { DragulaService } from 'ng2-dragula';
import { PersistanceController } from '../classes';
import { FsGalleryPreviewComponent } from '../components';
import { FsGalleryItem } from '../interfaces';
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

  public openPreview(item: FsGalleryItem) {
    this.openPreviews([item]);
  }

  public openPreviews(items: FsGalleryItem[]) {
    const persistanceController = new PersistanceController(this._store, this._route);

    const galleryService = new FsGalleryService(FsGalleryPreviewComponent, this._overlay, this._injector, this._location, this._dragulaService, persistanceController);
    galleryService.data = items;

    galleryService.openPreview(galleryService.data[0])
      .onClose
      .pipe(
        take(1),
      )
      .subscribe(() => {

      });
  }
}
