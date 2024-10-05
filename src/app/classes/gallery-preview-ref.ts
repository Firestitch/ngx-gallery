import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';


export class FsGalleryPreviewRef {

  public onClose = new Subject();

  constructor(private _overlayRef: OverlayRef) { }

  public get overlayRef() {
    return this._overlayRef;
  }

  public close(): void {
    this.onClose.next(null);
    this.onClose.complete();
    this._overlayRef.dispose();
  }
}
