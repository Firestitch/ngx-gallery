import { FsGalleryThumbnailConfig } from './gallery-thumbnail-config.interface';


export interface FsGalleryConfig {
  indexField?: string;
  repeat?: boolean;
  draggable?: boolean;
  filter?: any;
  upload?: (query) => void;
  fetch?: (query) => void;
  filters?: any[];
  zoom?: boolean;
  dragName?: string;
  showCarousel?: boolean;
  overwriteThumbnailTemplate?: boolean;
  thumbnail?: FsGalleryThumbnailConfig;
}
