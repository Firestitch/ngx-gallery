import { Component, Input } from '@angular/core';


@Component({
  selector: 'fs-gallery-file-icon',
  templateUrl: './gallery-file-icon.component.html',
  styleUrls: [
    './gallery-file-icon.component.scss',
  ]
})
export class FsGalleryFileIconComponent {

  @Input()
  public type: string;

  @Input()
  public subtype: string;

}
