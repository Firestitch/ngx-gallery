import { Directive, TemplateRef } from '@angular/core';

import { FsGalleryItem } from '../interfaces';


@Directive({
  selector: '[fsGalleryThumbnailPreview]',
})
export class FsGalleryThumbnailPreviewDirective {
  
  public static ngTemplateContextGuard(
    directive: FsGalleryThumbnailPreviewDirective,
    context: unknown,
  ): context is { 
    item: FsGalleryItem,
    template: TemplateRef<any>
  } {
    return true;
  }
}
