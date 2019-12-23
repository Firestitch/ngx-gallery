import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

import { FsFilterModule } from '@firestitch/filter';
import { FsFileModule } from '@firestitch/file';
import { FsMenuModule } from '@firestitch/menu';
import { FsPromptModule } from '@firestitch/prompt';

import { DragulaModule } from 'ng2-dragula';

import { FsGalleryComponent } from './components/gallery/gallery.component';
import { FsGalleryPreviewComponent } from './components/gallery-preview/gallery-preview.component';
import { FsGalleryPreviewCarouselComponent } from './components/gallery-preview/carousel/gallery-preview-carousel.component';
import { FsGalleryPreviewHeaderComponent } from './components/gallery-preview/header/gallery-preview-header.component';
import { FsGalleryThumbnailComponent } from './components/gallery-thumbnail/gallery-thumbnail.component';
import { FsGalleryHeaderComponent } from './components/header/header.component';
import { FsGalleryZoomControlComponent } from './components/header/zoom-control/zoom-control.component';
import { FsGalleryThumbnailInfoComponent } from './components/gallery-thumbnail-info/gallery-thumbnail-info.component';
import { FsGalleryThumbnailPreviewComponent } from './components/gallery-thumbnail-preview/gallery-thumbnail-preview.component';
import { FsGalleryGroupComponent } from './components/group/group.component';

import { FsGalleryThumbnailDirective } from './directives/gallery-thumbnail.directive';
import { FsGalleryPreviewDirective } from './directives/gallery-preview.directive';
import { FsGalleryThumbnailContainerDirective } from './directives/gallery-thumbnail-container.directive';

import { HammerConfig } from './classes/hammer-config';

import { GalleryPreviewComponentInjector } from './injectors/gallery-preview-component.injector';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    OverlayModule,
    DragulaModule,
    MatSliderModule,
    MatButtonModule,
    MatTooltipModule,
    FsFilterModule,
    FsFileModule,
    FsMenuModule,
    FsPromptModule,
  ],
  exports: [
    FsGalleryComponent,
    FsGalleryThumbnailInfoComponent,
    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective,
    FsGalleryThumbnailContainerDirective,
    FsGalleryThumbnailPreviewComponent
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
    FsGalleryThumbnailInfoComponent,
    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective,
    FsGalleryThumbnailContainerDirective,
    FsGalleryThumbnailPreviewComponent,
    FsGalleryGroupComponent,
  ]
})
export class FsGalleryModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsGalleryModule,
      providers: [
        {
          provide: GalleryPreviewComponentInjector,
          useValue: FsGalleryPreviewComponent
        },
        {
          provide: HAMMER_GESTURE_CONFIG,
          useClass: HammerConfig
        }
      ]
    };
  }

}
