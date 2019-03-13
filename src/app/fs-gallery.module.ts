import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatSliderModule } from '@angular/material';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { FsFilterModule } from '@firestitch/filter';
import { FsFileModule } from '@firestitch/file';

import { DragulaModule } from 'ng2-dragula';

import { FsGalleryComponent } from './components/gallery/gallery.component';
import { FsGalleryPreviewComponent } from './components/gallery-preview/gallery-preview.component';
import { FsGalleryPreviewCarouselComponent } from './components/gallery-preview/carousel/gallery-preview-carousel.component';
import { FsGalleryPreviewHeaderComponent } from './components/gallery-preview/header/gallery-preview-header.component';
import { FsGalleryThumbnailComponent } from './components/gallery-thumbnail/gallery-thumbnail.component';
import { FsGalleryHeaderComponent } from './components/header/header.component';
import { FsGalleryZoomControlComponent } from './components/header/zoom-control/zoom-control.component';
import { FsGalleryThumbnailDirective } from './directives/gallery-thumbnail.directive';

import { FsGalleryPreviewDirective } from './directives/gallery-preview.directive';
import { FsGalleryPreviewService } from './services/gallery-preview.service';

import { FsGalleryPreviewFactory } from './services/gallery-preview-factory.service';
import { HammerConfig } from './classes/hammer-config';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    DragulaModule,
    MatSliderModule,
    MatButtonModule,
    FsFilterModule,
    FsFileModule,
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
    FsGalleryHeaderComponent,
    FsGalleryZoomControlComponent,

    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective
  ],
  providers: []
})
export class FsGalleryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsGalleryModule,
      providers: [
        FsGalleryPreviewService,
        FsGalleryPreviewFactory,
        {
          provide: HAMMER_GESTURE_CONFIG,
          useClass: HammerConfig
        }
      ]
    };
  }

}
