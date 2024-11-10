import { Directive, TemplateRef } from '@angular/core';

import { FsGalleryItem } from '../interfaces';


@Directive({
  selector: '[fsGalleryThumbnail]',
})
export class FsGalleryThumbnailDirective {

  public static ngTemplateContextGuard(
    directive: FsGalleryThumbnailDirective,
    context: unknown,
  ): context is {
    $implicit: FsGalleryItem,
    item: FsGalleryItem,
    template: TemplateRef<any>
  } {
    return true;
  }

}
