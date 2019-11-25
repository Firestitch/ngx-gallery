import { FsGalleryThumbnailConfig } from './gallery-thumbnail-config.interface';
import { Observable } from 'rxjs';
import { GalleryLayout } from '../enums/gallery-layout-enum';


export interface FsGalleryConfig {
  allowedFiles?: string;
  indexField?: string;
  fileField?: string;
  imageField?: string;
  thumbnailField?: string;
  nameField?: string;
  repeat?: boolean;
  toolbar?: boolean;
  draggable?: boolean;
  layout?: GalleryLayout;
  filter?: any;
  upload?: (query) => void;
  fetch?: (query) => Observable<FsGalleryItem[]> | FsGalleryItem[];
  filters?: any[];
  zoom?: boolean;
  reorderEnd?(data: any): any,
  previewBeforeOpen?(item: FsGalleryItem): any,
  previewOpened?(item: FsGalleryItem): any,
  previewClosed?(item: FsGalleryItem): any,
  dragName?: string;
  imageHeightScale?: number;
  imageWidth?: number;
  info?: boolean | FsGalleryInfoConfig;
  showCarousel?: boolean;
  thumbnail?: FsGalleryThumbnailConfig;
}

export interface FsGalleryItem {
  [key: string]: any;
}

export interface FsGalleryInfoConfig {
  icon?: boolean;
  menu?: FsGalleryInfoMenuConfig;
}

export interface FsGalleryInfoMenuConfig {
  actions?: FsGalleryInfoMenuActionConfig[];
}

export interface FsGalleryInfoMenuActionConfig {
  label?: string;
  click?(item: FsGalleryItem): any
}
