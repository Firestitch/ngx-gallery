import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsGalleryPreviewDetails]',
})
export class FsGalleryPreviewDetailsDirective {

  constructor(
    public templateRef: TemplateRef<any>,
  ) { }

}
