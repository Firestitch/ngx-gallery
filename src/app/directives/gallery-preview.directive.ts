import { Directive, TemplateRef } from '@angular/core';

import { FsGalleryItem } from '../interfaces';


@Directive({
  selector: '[fsGalleryPreview]',
})
export class FsGalleryPreviewDirective {

  public static ngTemplateContextGuard(
    directive: FsGalleryPreviewDirective,
    context: unknown,
  ): context is {
    $implicit: FsGalleryItem,
    item: FsGalleryItem,
    template: TemplateRef<any>
  } {
    return true;
  }
}
