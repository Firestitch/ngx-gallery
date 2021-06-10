import {
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

// Directives
import { FsGalleryListHeaderDirective } from '../header/header.directive';
import { FsGalleryListCellDirective } from '../cell/cell.directive';

import { FsGalleryCellConfig } from '../../interfaces/gallery-cellconfig.interface';


@Directive({
  selector: 'fs-gallery-list-column',
})
export class FsGalleryListColumnDirective {
  @Input() public title: string;
  @Input() public name: string;
  @Input() public show = true;
  @Input() public customize = true;
  @Input() public sortable: boolean;
  @Input() public direction: 'asc' | 'desc';
  @Input() public align: string;
  @Input() public width: string;
  @Input('class') public className: string | string[];

  // Header
  @ContentChild(FsGalleryListHeaderDirective, { read: TemplateRef, static: true })
  public headerTemplate: TemplateRef<any>;

  @ContentChild(FsGalleryListHeaderDirective, { static: true })
  public headerConfigs: FsGalleryCellConfig;

  // Cell
  @ContentChild(FsGalleryListCellDirective, { read: TemplateRef, static: true })
  public cellTemplate: TemplateRef<any>;

  @ContentChild(FsGalleryListCellDirective, { static: true })
  public cellConfigs: FsGalleryCellConfig;

}
