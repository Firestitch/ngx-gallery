import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { DragulaModule } from 'ng2-dragula';

import {
  FsGalleryComponent,
  FsGalleryThumbnailComponent,
  FsGalleryPreviewComponent,
  FsGalleryPreviewHeaderComponent,
  FsGalleryPreviewCarouselComponent
} from './components';

import {
  FsGalleryThumbnailDirective,
  FsGalleryPreviewDirective
} from './directives';

import {
  FsGalleryPreviewService,
  FsGalleryPreviewFactory
} from './services';

import 'hammerjs';
import { HammerConfig } from './classes';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    DragulaModule.forRoot()
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
    FsGalleryPreviewHeaderComponent,
    FsGalleryPreviewCarouselComponent,

    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective
  ],
  providers: [
    FsGalleryPreviewFactory,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }
  ]
})
export class FsGalleryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsGalleryModule,
      providers: [
        FsGalleryPreviewService
      ]
    };
  }

}
