import { Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { FsGalleryDataItem } from '../interfaces/gallery-data-item.interface';
import { FsGalleryPreviewRef } from '../classes/gallery-preview-ref';
import { PREVIEW_DATA } from '../injectors/preview-data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


export class FsGalleryPreviewService {

  private _router: Router;
  private _route: ActivatedRoute;
  private _previewRef: FsGalleryPreviewRef;
  private _destroy$ = new Subject();

  constructor(
    private _overlay: Overlay,
    private _galleryPreviewComponent,
    private _injector: Injector
  ) {
    this._router = this._injector.get(Router);
    this._route = this._injector.get(ActivatedRoute);
  }

  public open(data: FsGalleryDataItem) {
    const overlayRef = this._createOverlay();
    this._previewRef = new FsGalleryPreviewRef(overlayRef);

    this._openPortalPreview(this._injector, overlayRef, this._previewRef, data);

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { galleryPreview: true },
      queryParamsHandling: 'merge',
    }).then();

    this._previewRef.onClose
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._previewRef = null;
      });

    return this._previewRef;
  }

  public close() {
    this._previewRef?.close();
  }

  public destroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig({
      height: '100%',
      width: '100%'
    });

    const overlayRef = this._overlay.create(overlayConfig);

    overlayRef.detachments()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._router.navigate([], {
          relativeTo: this._route,
          queryParams: { galleryPreview: null },
          queryParamsHandling: 'merge',
        }).then(() => { });

      });

    return overlayRef;
  }

  private _openPortalPreview(
    parentInjector: Injector,
    overlayRef: OverlayRef,
    previewRef: FsGalleryPreviewRef,
    data: FsGalleryDataItem,
  ) {
    const injector = this._createInjector(parentInjector, previewRef, data);
    const containerPortal = new ComponentPortal(this._galleryPreviewComponent, undefined, injector);
    const containerRef = overlayRef.attach<any>(containerPortal);

    setTimeout(() => {
      const overlayContainer = overlayRef.overlayElement.parentNode;
      overlayContainer.parentNode.append(overlayContainer);
    });

    return containerRef.instance;
  }

  private _createInjector(parentInjector: Injector, previewRef: FsGalleryPreviewRef, data: FsGalleryDataItem) {
    return Injector.create({
      parent: parentInjector,
      providers: [
        { provide: FsGalleryPreviewRef, useValue: previewRef },
        { provide: PREVIEW_DATA, useValue: data }
      ]
    });
  }
}
