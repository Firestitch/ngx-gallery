import { FsGalleryThumbnailConfig } from './gallery-thumbnail-config.interface';
import { Observable } from 'rxjs';


export interface FsGalleryConfig {
  allowedFiles?: string;
  indexField?: string;
  fileField?: string;
  imageField?: string;
  thumbnailField?: string;
  nameField?: string;
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

export interface FsGalleryItem {
  [key: string]: any;
}
