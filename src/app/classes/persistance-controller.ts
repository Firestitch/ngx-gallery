import { Injectable } from '@angular/core';

import { FsPersistanceStore } from '@firestitch/store';

import { FsGalleryPersistance } from '../interfaces/gallery-persist-config.interface';

const FILTER_STORE_KEY = 'fs-gallery-persist';

@Injectable()
export class PersistanceController extends FsPersistanceStore<FsGalleryPersistance> {

  protected STORE_KEY = FILTER_STORE_KEY;

}
