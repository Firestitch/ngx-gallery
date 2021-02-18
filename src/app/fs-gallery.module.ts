import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';

import { FsListModule } from '@firestitch/list';
import { FsFilterModule } from '@firestitch/filter';
import { FsFileModule } from '@firestitch/file';
import { FsMenuModule } from '@firestitch/menu';

import { DragulaModule } from 'ng2-dragula';

import { FsGalleryComponent } from './components/gallery/gallery.component';
import { FsGalleryPreviewComponent } from './components/gallery-preview/gallery-preview.component';
import { FsGalleryPreviewCarouselComponent } from './components/gallery-preview/carousel/gallery-preview-carousel.component';
import { FsGalleryPreviewHeaderComponent } from './components/gallery-preview/header/gallery-preview-header.component';
import { FsGalleryThumbnailComponent } from './components/gallery-thumbnail/gallery-thumbnail.component';
import { FsGalleryThumbnailDirective } from './directives/gallery-thumbnail.directive';

import { FsGalleryPreviewDirective } from './directives/gallery-preview.directive';

import { HammerConfig } from './classes/hammer-config';
import { FsGalleryThumbnailInfoComponent } from './components/gallery-thumbnail-info/gallery-thumbnail-info.component';
import { FsGalleryThumbnailContainerDirective } from './directives/gallery-thumbnail-container.directive';
import { FsGalleryThumbnailPreviewComponent } from './components/gallery-thumbnail-preview/gallery-thumbnail-preview.component';
import { GalleryPreviewComponentInjector } from './injectors/gallery-preview-component.injector';
import { FsGalleryListViewComponent } from './components/list-view/list-view.component';
import { FsGalleryFileIconComponent } from './components/gallery-file-icon/gallery-file-icon.component';


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
    FsListModule,
    FsMenuModule
  ],
  exports: [
    FsGalleryComponent,
    FsGalleryThumbnailInfoComponent,
    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective,
    FsGalleryThumbnailContainerDirective,
    FsGalleryThumbnailPreviewComponent
  ],
  declarations: [
    FsGalleryComponent,
    FsGalleryThumbnailComponent,
    FsGalleryPreviewComponent,
    FsGalleryPreviewHeaderComponent,
    FsGalleryPreviewCarouselComponent,
    FsGalleryThumbnailInfoComponent,
    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective,
    FsGalleryThumbnailContainerDirective,
    FsGalleryFileIconComponent,
    FsGalleryThumbnailPreviewComponent,
    FsGalleryListViewComponent,
  ]
})
export class FsGalleryModule {
  static forRoot(): ModuleWithProviders<FsGalleryModule> {
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
