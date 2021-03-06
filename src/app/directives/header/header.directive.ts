import { Directive, Input } from '@angular/core';

@Directive({ selector: '[fs-gallery-list-header]' })
export class FsGalleryListHeaderDirective {
  @Input() public colspan;
  @Input() public align: string;
  @Input('class') public className: string | string[];
}
