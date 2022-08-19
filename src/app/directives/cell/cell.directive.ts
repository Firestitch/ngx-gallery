import { Directive, Input } from '@angular/core';

@Directive({ 
  selector: '[fs-gallery-list-cell],[fsGalleryListCell]' 
})
export class FsGalleryListCellDirective {

  @Input() public colspan;
  @Input() public align: string;
  @Input('class') public className: string | string[];

}
