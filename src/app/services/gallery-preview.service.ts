import { Injector, Injectable, Inject } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

import { FsGalleryPreviewComponent } from '../components/gallery-preview/gallery-preview.component';

import { FsGalleryDataItem } from '../interfaces/gallery-data-item.interface';
import { FsGalleryPreviewRef } from '../classes/gallery-preview-ref';
import { PREVIEW_DATA } from './preview-data';


export class FsGalleryPreviewService {

  constructor(
    private _overlay: Overlay,
    private _galleryPreviewComponent,
    private _injector: Injector
  ) {}

  public open(data: FsGalleryDataItem) {
    const overlayRef = this._createOverlay();
    const previewRef = new FsGalleryPreviewRef(overlayRef);

    this.openPortalPreview(this._injector, overlayRef, previewRef, data);

    return previewRef;
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig({
      height: '100%',
      width: '100%'
    });
    return this._overlay.create(overlayConfig);
  }

  private openPortalPreview(
    parentInjector: Injector,
    overlayRef: OverlayRef,
    previewRef: FsGalleryPreviewRef,
    data: FsGalleryDataItem,
  ) {
    const injector = this._createInjector(parentInjector, previewRef, data);
    const containerPortal = new ComponentPortal(this._galleryPreviewComponent, undefined, injector);
    const containerRef = overlayRef.attach<any>(containerPortal);

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
