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
    item: FsGalleryItem,
    template: TemplateRef<any>
  } {
    return true;
  }
  
}
