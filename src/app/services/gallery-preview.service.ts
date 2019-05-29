import { Injectable, Injector } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

import { FsGalleryPreviewComponent } from '../components/gallery-preview/gallery-preview.component';

import { FsGalleryDataItem } from '../interfaces/gallery-data-item.interface';
import { FsGalleryPreviewRef } from '../classes/gallery-preview-ref';
import { PREVIEW_DATA } from './preview-data';


@Injectable()
export class FsGalleryPreviewService {

  constructor(
    private _overlay: Overlay,
  ) {}

  public open(injector: Injector, data: FsGalleryDataItem) {
    const overlayRef = this._createOverlay();
    const previewRef = new FsGalleryPreviewRef(overlayRef);

    return this.openPortalPreview(injector, overlayRef, previewRef, data);
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig();
    return this._overlay.create(overlayConfig);
  }

  private openPortalPreview(
    parentInjector: Injector,
    overlayRef: OverlayRef,
    previewRef: FsGalleryPreviewRef,
    data: FsGalleryDataItem,
  ) {
    const injector = this._createInjector(parentInjector, previewRef, data);
    const containerPortal = new ComponentPortal(FsGalleryPreviewComponent, undefined, injector);
    const containerRef = overlayRef.attach<FsGalleryPreviewComponent>(containerPortal);

    return containerRef.instance;
  }


  private _createInjector(parentInjector, previewRef, data) {
    const injectionTokens = new WeakMap<any, any>([
      [FsGalleryPreviewRef, previewRef],
      [PREVIEW_DATA, data]
    ]);

    return new PortalInjector(parentInjector, injectionTokens);
  }
}
