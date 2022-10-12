// Hack
(window as any).global = window;

export { FsGalleryModule } from './app/fs-gallery.module';

export {
  FsGalleryIconComponent,
  FsGalleryFileIconComponent,
  FsGalleryPreviewComponent,
  FsGalleryComponent,
  FsGalleryPreviewCarouselComponent,
  FsGalleryPreviewHeaderComponent,
  FsGalleryNavComponent,
  FsGalleryThumbnailInfoComponent,
  FsGalleryThumbnailComponent,
  FsGalleryThumbnailPreviewComponent,
} from './app/components';


export {
  FsGalleryThumbnailDirective,
  FsGalleryThumbnailPreviewDirective,
  FsGalleryPreviewDirective,
  FsGalleryPreviewDetailsDirective,
  FsGalleryNavDirective,
  FsGalleryListColumnDirective,
  FsGalleryListCellDirective,
  FsGalleryListHeaderDirective,
} from './app/directives';

export {
  FsGalleryConfig,
  FsGalleryItem,
  FsGalleryNoResultsConfig,
  FsGalleryDataItem,
  FsGalleryThumbnailConfig,
} from './app/interfaces';

export { FsGalleryPreviewService, FsGalleryService } from './app/services';

export { GalleryLayout, MimeType, ThumbnailScale, GalleryThumbnailSize } from './app/enums';

export * from './app/helpers';
