import { Directive, TemplateRef, inject } from '@angular/core';

import { FsGalleryItem } from '../interfaces';


@Directive({
    selector: '[fsGalleryPreviewDetails]',
    standalone: true,
})
export class FsGalleryPreviewDetailsDirective {
  templateRef = inject<TemplateRef<any>>(TemplateRef);


  public static ngTemplateContextGuard(
    directive: FsGalleryPreviewDetailsDirective,
    context: unknown,
  ): context is {
    $implicit: FsGalleryItem,
    item: FsGalleryItem,
    template: TemplateRef<any>
  } {
    return true;
  }

}
