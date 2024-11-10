import { Directive, Input } from '@angular/core';

import { FsGalleryItem } from '../interfaces';

@Directive({
  selector: '[fs-gallery-list-cell],[fsGalleryListCell]',
})
export class FsGalleryListCellDirective {

  @Input() public colspan;
  @Input() public align: string;
  @Input('class') public className: string | string[];

  public static ngTemplateContextGuard(
    directive: FsGalleryListCellDirective,
    context: unknown,
  ): context is {
    $implicit: FsGalleryItem,
    row: FsGalleryItem,
    openPreview: (item: FsGalleryItem) => void,
  } {
    return true;
  }
}
