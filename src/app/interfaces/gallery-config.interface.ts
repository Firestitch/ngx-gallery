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
  group?: FsGalleryGroupConfig;
  reorderEnd?(data: any, relGroup?: any): any;
  previewBeforeOpen?(item: FsGalleryItem): any;
  previewOpened?(item: FsGalleryItem): any;
  previewClosed?(item: FsGalleryItem): any;
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

export interface FsGalleryGroupConfig {
  groups: any[];
  groupWith: FsGalleryGroupWithFn;
  nameValue?: FsGalleryNameValueFn;
  groupTrackBy?: FsGalleryGroupTrackByFn;
  added?: FsGalleryGroupAddedFn;
  changed?: FsGalleryGroupChangedFn;
  deleted?: FsGalleryGroupDeletedFn;
  reorderEnd?: FsGalleryGroupReorderChangeFn;
}

export interface FsGalleryGroupWithFn {
  (item: FsGalleryItem): string | number;
}

export interface FsGalleryNameValueFn {
  (group: any): string;
}

export interface FsGalleryGroupTrackByFn {
  (group: any): any;
}

export interface FsGalleryGroupTrackByFn {
  (group: any): any;
}

export interface FsGalleryGroupDeletedFn {
  (group: any, items: FsGalleryItem[]): Observable<any>;
}

export interface FsGalleryGroupChangedFn {
  (group: any, items: FsGalleryItem[]): Observable<any>;
}

export interface FsGalleryGroupAddedFn {
  (name: string): Observable<any>;
}

export interface FsGalleryGroupReorderChangeFn {
  (groups: any);
}
