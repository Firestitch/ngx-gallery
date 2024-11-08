import { Directive, TemplateRef } from '@angular/core';

import { FsGalleryItem } from '../interfaces';


@Directive({
  selector: '[fsGalleryPreviewDetails]',
})
export class FsGalleryPreviewDetailsDirective {

  constructor(
    public templateRef: TemplateRef<any>,
  ) { }

  public static ngTemplateContextGuard(
    directive: FsGalleryPreviewDetailsDirective,
    context: unknown,
  ): context is { 
    item: FsGalleryItem,
    template: TemplateRef<any>
  } {
    return true;
  }

}
