import { FsGalleryThumbnailConfig } from './gallery-thumbnail-config.interface';
import { Observable } from 'rxjs';


export interface FsGalleryConfig {
  allowedFiles?: string;
  indexField?: string;
  repeat?: boolean;
  draggable?: boolean;
  filter?: any;
  upload?: (query) => void;
  fetch?: (query) => Observable<FsGalleryItem[]> | FsGalleryItem[];
  filters?: any[];
  zoom?: boolean;
  dragName?: string;
  showCarousel?: boolean;
  overwriteThumbnailTemplate?: boolean;
  thumbnail?: FsGalleryThumbnailConfig;
}

export type FsGalleryItem = FsGalleryItemData & (FsGalleryImageItem | FsGalleryFileItem);

export interface FsGalleryItemData {
  [key: string]: any;
}

export interface FsGalleryImageItem {
  image: {
    small?: string;
    large?: string;
  } | string;
}

export interface FsGalleryFileItem {
  file: string;
}
