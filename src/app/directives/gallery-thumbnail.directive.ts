import { Directive, Input } from '@angular/core';


@Directive({
  selector: '[fsGalleryThumbnail]'
})
export class FsGalleryThumbnailDirective {

  @Input() public image: string = null;
}
