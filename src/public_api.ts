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
export { FsGalleryEmptyStateDirective } from './app/directives/empty-state.directive';

export {
  FsGalleryConfig,
  FsGalleryItem,
  FsGalleryNoResultsConfig,
  FsGalleryDataItem,
  FsGalleryThumbnailConfig,
  FsGalleryInfoMenuActionConfig,
  FsGalleryInfoMenuConfig,
  FsGalleryPreviewAction,
  FsGalleryPreviewMenu,
  FsGalleryPreviewMenuItem,
  FsGalleryEmptyStateConfig,
} from './app/interfaces';

export { FsGalleryPreviewService, FsGalleryService } from './app/services';

export { GalleryLayout, MimeType, ThumbnailScale, GalleryThumbnailSize } from './app/enums';

export * from './app/helpers';
