import { Injectable } from '@angular/core';


@Injectable()
export class FsGalleryPreviewService {

  private _instance = null;

  set instance(value) {

    if (value && this._instance) {
      this.close();
    }

    this._instance = value;
  }

  get instance() {
    return this._instance;
  }

  get opened() {
    return !!this.instance;
  }

  constructor() { }

  close() {
    this.instance.destroy();
  }
}
