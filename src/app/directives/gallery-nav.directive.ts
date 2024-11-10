import { Directive, TemplateRef } from '@angular/core';


@Directive({
  selector: '[fsGalleryNav]',
})
export class FsGalleryNavDirective {

  public static ngTemplateContextGuard(
    directive: FsGalleryNavDirective,
    context: unknown,
  ): context is {
    $implicit: TemplateRef<any>,
    template: TemplateRef<any>
  } {
    return true;
  }

}
