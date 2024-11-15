import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { OverlayModule } from '@angular/cdk/overlay';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsFileModule } from '@firestitch/file';
import { FsFilterModule } from '@firestitch/filter';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsMenuModule } from '@firestitch/menu';
import { FsPdfViewerModule } from '@firestitch/pdf-viewer';


import { HammerConfig } from './classes/hammer-config';
import {
  FsGalleryFolderIconInfoComponent, FsGalleryIconComponent,
  FsGalleryMenuComponent, FsGalleryNavComponent,
  FsGalleryPreviewDetailsComponent, FsGalleryThumbnailInfoComponent,
  FsGalleryThumbnailPreviewComponent,
} from './components';
import { FsGalleryFileIconComponent } from './components/gallery-file-icon/gallery-file-icon.component';
import { FsGalleryPreviewCarouselComponent } from './components/gallery-preview/carousel/gallery-preview-carousel.component';
import { FsGalleryPreviewComponent } from './components/gallery-preview/gallery-preview.component';
import { FsGalleryPreviewHeaderComponent } from './components/gallery-preview/header/gallery-preview-header.component';
import { FsGalleryThumbnailComponent } from './components/gallery-thumbnail/gallery-thumbnail.component';
import { FsGalleryViewComponent } from './components/gallery-view/gallery-view.component';
import { FsGalleryComponent } from './components/gallery/gallery.component';
import { FsGalleryListViewComponent } from './components/list-view/list-view.component';
import { FsGalleryNavDirective, FsGalleryPreviewDetailsDirective } from './directives';
import { FsGalleryListCellDirective } from './directives/cell.directive';
import { FsGalleryListColumnDirective } from './directives/column.directive';
import { FsGalleryEmptyStateDirective } from './directives/empty-state.directive';
import { FsGalleryPreviewDirective } from './directives/gallery-preview.directive';
import { FsGalleryThumbnailPreviewDirective } from './directives/gallery-thumbnail-preview.directive';
import { FsGalleryThumbnailDirective } from './directives/gallery-thumbnail.directive';
import { FsGalleryListHeaderDirective } from './directives/header.directive';
import { ImageSrcPipe } from './pipes';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSidenavModule,

    FsFilterModule,
    FsFileModule,
    FsListModule,
    FsMenuModule,
    FsLabelModule,
    FsPdfViewerModule,

    OverlayModule,
    CdkDropList,
    CdkDrag,
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
    ImageSrcPipe,
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
  public static forRoot(): ModuleWithProviders<FsGalleryModule> {
    return {
      ngModule: FsGalleryModule,
      providers: [
        {
          provide: HAMMER_GESTURE_CONFIG,
          useClass: HammerConfig,
        },
      ],
    };
  }

}
