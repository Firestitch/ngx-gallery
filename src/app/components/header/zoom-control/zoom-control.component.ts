import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material';


@Component({
  selector: 'fs-gallery-zoom-control',
  templateUrl: './zoom-control.component.html',
  styleUrls: [ './zoom-control.component.scss' ]
})
export class FsGalleryZoomControlComponent {
  @Input() public min = 100;
  @Input() public max = 500;
  @Input() public step = 1;
  @Input() public zoom = 0;

  @Output() public change = new EventEmitter<number>();

  public zoomInDisabled = false;
  public zoomOutDisabled  = false;

  constructor() {}

  public updateImageZoom(event: MatSliderChange) {
    this.zoom = event.value;
    this.change.next(this.zoom);
  }

  public zoomIn() {
    this.zoom += 10;

    if (this.zoom >= this.max) {
      this.zoom = this.max;
      this.zoomInDisabled = true;
    }

    this.zoomOutDisabled = false;

    this.change.next(this.zoom);
  }

  public zoomOut() {
    this.zoom -= 10;

    if (this.zoom <= this.min) {
      this.zoom = this.min;
      this.zoomOutDisabled = true;
    }

    this.zoomInDisabled = false;

    this.change.next(this.zoom);
  }
}
