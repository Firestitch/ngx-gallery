import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { FsFileModule } from '@firestitch/file';
import { FsFilterModule } from '@firestitch/filter';
import { FsListModule } from '@firestitch/list';
import { FsMenuModule } from '@firestitch/menu';
import { FsPdfViewerModule } from '@firestitch/pdf-viewer';

import { DragulaModule } from 'ng2-dragula';

import { FsGalleryPreviewCarouselComponent } from './components/gallery-preview/carousel/gallery-preview-carousel.component';
import { FsGalleryPreviewComponent } from './components/gallery-preview/gallery-preview.component';
import { FsGalleryPreviewHeaderComponent } from './components/gallery-preview/header/gallery-preview-header.component';
import { FsGalleryThumbnailComponent } from './components/gallery-thumbnail/gallery-thumbnail.component';
import { FsGalleryComponent } from './components/gallery/gallery.component';
import { FsGalleryThumbnailDirective } from './directives/gallery-thumbnail.directive';

import { FsGalleryPreviewDirective } from './directives/gallery-preview.directive';

import { HammerConfig } from './classes/hammer-config';
import { FsGalleryFileIconComponent } from './components/gallery-file-icon/gallery-file-icon.component';
import { FsGalleryViewComponent } from './components/gallery-view/gallery-view.component';
import { FsGalleryListViewComponent } from './components/list-view/list-view.component';
import { FsGalleryThumbnailPreviewDirective } from './directives/gallery-thumbnail-preview.directive';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FsLabelModule } from '@firestitch/label';
import {
  FsGalleryFolderIconInfoComponent, FsGalleryIconComponent, FsGalleryMenuComponent, FsGalleryNavComponent,
  FsGalleryPreviewDetailsComponent, FsGalleryThumbnailInfoComponent, FsGalleryThumbnailPreviewComponent
} from './components';
import { FsGalleryNavDirective, FsGalleryPreviewDetailsDirective } from './directives';
import { FsGalleryListCellDirective } from './directives/cell.directive';
import { FsGalleryListColumnDirective } from './directives/column.directive';
import { FsGalleryEmptyStateDirective } from './directives/empty-state.directive';
import { FsGalleryListHeaderDirective } from './directives/header.directive';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatSidenavModule,

    FsFilterModule,
    FsFileModule,
    FsListModule,
    FsMenuModule,
    FsLabelModule,
    FsPdfViewerModule,

    OverlayModule,
    DragulaModule,
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
    FsGalleryThumbnailPreviewDirective,
    FsGalleryFileIconComponent,
    FsGalleryThumbnailPreviewComponent,
    FsGalleryListViewComponent,
    FsGalleryListColumnDirective,
    FsGalleryListCellDirective,
    FsGalleryListHeaderDirective,
    FsGalleryViewComponent,
    FsGalleryIconComponent,
    FsGalleryPreviewDetailsComponent,
    FsGalleryPreviewDetailsDirective,
    FsGalleryFolderIconInfoComponent,
    FsGalleryNavComponent,
    FsGalleryNavDirective,
    FsGalleryEmptyStateDirective,
    FsGalleryMenuComponent,
  ],
  exports: [
    FsGalleryComponent,
    FsGalleryThumbnailInfoComponent,
    FsGalleryThumbnailDirective,
    FsGalleryPreviewDirective,
    FsGalleryThumbnailPreviewDirective,
    FsGalleryThumbnailPreviewComponent,
    FsGalleryListColumnDirective,
    FsGalleryListCellDirective,
    FsGalleryListHeaderDirective,
    FsGalleryIconComponent,
    FsGalleryFileIconComponent,
    FsGalleryPreviewDetailsDirective,
    FsGalleryNavComponent,
    FsGalleryNavDirective,
    FsGalleryEmptyStateDirective,
  ],
})
export class FsGalleryModule {
  static forRoot(): ModuleWithProviders<FsGalleryModule> {
    return {
      ngModule: FsGalleryModule,
      providers: [
        {
          provide: HAMMER_GESTURE_CONFIG,
          useClass: HammerConfig
        }
      ]
    };
  }

}
