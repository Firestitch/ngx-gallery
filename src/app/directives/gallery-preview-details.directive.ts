import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsGalleryPreviewDetails]'
})
export class FsGalleryPreviewDetailsDirective {

  public constructor(
    public templateRef: TemplateRef<any>
  ) { }

}
