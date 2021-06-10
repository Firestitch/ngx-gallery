import { Directive, Input } from '@angular/core';

@Directive({ selector: '[fs-gallery-list-cell]' })
export class FsGalleryListCellDirective {
  @Input() public colspan;
  @Input() public align: string;
  @Input('class') public className: string | string[];
}
