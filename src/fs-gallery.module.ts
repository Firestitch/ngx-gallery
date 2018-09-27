import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import {
  FsGalleryComponent,
  FsGalleryThumbnailComponent,
  FsGalleryPreviewComponent
} from './components';

import {
  FsGalleryThumbnailDirective,
  FsGalleryPreviewDirective
} from './directives';

import {
  FsGalleryService,
  FsGalleryPreviewService,
  FsGalleryPreviewFactory
} from './services';


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
    FsGalleryPreviewComponent
  ],
  declarations: [
    FsGalleryComponent,
    FsGalleryThumbnailComponent,
    FsGalleryPreviewComponent,

    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective
  ],
  providers: [
    FsGalleryPreviewFactory
  ]
})
export class FsGalleryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsGalleryModule,
      providers: [FsGalleryPreviewService]
    };
  }
}
