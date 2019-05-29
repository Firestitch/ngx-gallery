import { OverlayRef } from '@angular/cdk/overlay';


export class FsGalleryPreviewRef {
  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}
