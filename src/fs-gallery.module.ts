import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import {
  FsGalleryComponent,
  FsGalleryThumbnailComponent
} from './components';

import {
  FsGalleryThumbnailDirective,
  FsGalleryPreviewDirective
} from './directives';

import { FsGalleryService } from './services';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    FsGalleryComponent,

    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective
  ],
  entryComponents: [
  ],
  declarations: [
    FsGalleryComponent,
    FsGalleryThumbnailComponent,

    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective
  ],
  providers: []
})
export class FsGalleryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsGalleryModule,
      providers: [FsGalleryService]
    };
  }
}
