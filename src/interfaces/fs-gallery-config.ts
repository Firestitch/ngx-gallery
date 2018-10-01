import { FsGalleryThumbnailConfig } from './fs-gallery-thumbnail-config';


export interface FsGalleryConfig {
  indexField?: string;
  repeat?: boolean;
  draggable?: boolean;
  dragName?: string;
  thumbnail?: FsGalleryThumbnailConfig;
}
