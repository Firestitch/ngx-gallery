import { Directive, Input } from '@angular/core';


@Directive({
  selector: '[fsGalleryPreview]'
})
export class FsGalleryPreviewDirective {

  @Input() public image: string = null;
}
