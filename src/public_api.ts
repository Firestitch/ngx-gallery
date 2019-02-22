/*
 * Public API
 */

// Hack
(window as any).global = window;

// Modules
export { FsGalleryModule } from './app/fs-gallery.module';

// Components
export { FsGalleryComponent } from './app/components/gallery/gallery.component';
export { FsGalleryPreviewComponent } from './app/components/gallery-preview/gallery-preview.component';
export { FsGalleryPreviewCarouselComponent } from './app/components/gallery-preview/carousel/gallery-preview-carousel.component';
export { FsGalleryPreviewHeaderComponent } from './app/components/gallery-preview/header/gallery-preview-header.component';
export { FsGalleryThumbnailComponent } from './app/components/gallery-thumbnail/gallery-thumbnail.component';

// Directives
export { FsGalleryThumbnailDirective } from './app/directives/gallery-thumbnail.directive';
export { FsGalleryPreviewDirective } from './app/directives/gallery-preview.directive';

// Interfaces
export { FsGalleryDataItem } from './app/interfaces/gallery-data-item';
export { FsGalleryConfig } from './app/interfaces/gallery-config';
export { FsGalleryThumbnailConfig } from './app/interfaces/gallery-thumbnail-config';

// Services
export { FsGalleryPreviewFactory } from './app/services/gallery-preview-factory.service';
export { FsGalleryPreviewService } from './app/services/gallery-preview.service';
export { FsGalleryService } from './app/services/gallery.service';
