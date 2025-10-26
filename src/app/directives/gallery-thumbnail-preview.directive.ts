import { Directive, TemplateRef } from '@angular/core';

import { FsGalleryItem } from '../interfaces';


@Directive({
    selector: '[fsGalleryThumbnailPreview]',
    standalone: true,
})
export class FsGalleryThumbnailPreviewDirective {

  public static ngTemplateContextGuard(
    directive: FsGalleryThumbnailPreviewDirective,
    context: unknown,
  ): context is {
    $implicit: FsGalleryItem,
    item: FsGalleryItem,
    template: TemplateRef<any>
  } {
    return true;
  }
}
