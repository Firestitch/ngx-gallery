import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryPreviewRef } from '../classes/gallery-preview-ref';
import { PREVIEW_DATA } from '../injectors/preview-data';
import { FsGalleryDataItem } from '../interfaces/gallery-data-item.interface';

import { FsGalleryService } from './gallery.service';


export class FsGalleryPreviewService {

  private _router: Router;
  private _route: ActivatedRoute;
  private _previewRef: FsGalleryPreviewRef;
  private _destroy$ = new Subject();

  constructor(
    private _overlay: Overlay,
    private _galleryPreviewComponent,
    private _injector: Injector,
    private _galleryService: FsGalleryService = null,
  ) {
    this._router = this._injector.get(Router);
    this._route = this._injector.get(ActivatedRoute);
  }

  public open(data: FsGalleryDataItem): FsGalleryPreviewRef {
    const overlayRef = this._createOverlay();
    this._previewRef = new FsGalleryPreviewRef(overlayRef);

    this._openPortalPreview(this._injector, overlayRef, this._previewRef, data);

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { galleryPreview: true },
      queryParamsHandling: 'merge',
    }).then();

    this._previewRef
      .onClose
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
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _createOverlay() {
    const overlayConfig = new OverlayConfig({
      height: '100%',
      width: '100%',
      direction: null,
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
        }).then();

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
    const providers: any = [
      { provide: FsGalleryPreviewRef, useValue: previewRef },
      { provide: PREVIEW_DATA, useValue: data },
    ];

    if (this._galleryService) {
      providers.push({ provide: FsGalleryService, useValue: this._galleryService });
    }

    return Injector.create({
      parent: parentInjector,
      providers,
    });
  }
}
