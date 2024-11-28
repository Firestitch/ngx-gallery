import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';
import { FsFilterAction, IFilterConfigItem, IFsFilterFileAction } from '@firestitch/filter';
import { FsListNoResultsConfig, FsListSelectionConfig } from '@firestitch/list';

import { Observable } from 'rxjs';

import { MimeType } from '../enums';
import { GalleryLayout } from '../enums/gallery-layout.enum';

import { FsGalleryPersistance } from './gallery-persist-config.interface';
import { FsGalleryThumbnailConfig } from './gallery-thumbnail-config.interface';


export interface FsGalleryConfig {
  map?: (data: any) => FsGalleryMapping,
  draggable?: boolean;
  layout?: GalleryLayout;
  showChangeSize?: boolean;
  showChangeView?: boolean;
  reload?: boolean;
  filter?: any;
  upload?: FsGalleryUploadConfig;
  emptyState?: FsGalleryEmptyStateConfig;
  fetch?: FsGalleryConfigFetch;
  filters?: IFilterConfigItem[];
  actions?: FsFilterAction[];
  selection?: FsListSelectionConfig;
  zoom?: boolean;
  reorderEnd?(data: any): any,
  reorderStart?(event: { item: FsGalleryItem; el: any; source: any, handle: any, sibling: any }): boolean,
  previewBeforeOpen?(galleryItem: FsGalleryItem): Observable<FsGalleryItem>,
  previewOpened?(galleryItem: FsGalleryItem): any,
  previewClosed?(galleryItem: FsGalleryItem): any,
  itemActions?: FsGalleryItemAction[],
  preview?: boolean,
  zoomChanged?(item: number): any,
  info?: boolean | FsGalleryInfoConfig;
  showCarousel?: boolean;
  thumbnail?: FsGalleryThumbnailConfig;
  persist?: FsGalleryPersistance;
  noResults?: FsGalleryNoResultsConfig | boolean;
  details?: FsGalleryDetailsConfig | boolean;
}

export interface FsGalleryMapping {
  name?: string,
  preview?: string | FsApiFile | File | FsFile,
  url?: string | FsApiFile | File | FsFile,
  extension?: string,
  folder?: boolean,
}

export interface FsGalleryItem extends FsGalleryMapping {
  data?: any,
  items?: FsGalleryItem[],
  mime?: Mime,
  index?: number,
  contains?: FsGalleryItemContains,
  guid?: string,
}

export interface FsGalleryItemContains {
  folders?: number;
  files?: number;
  mimeTypes?: { [mimeType in MimeType]?: number };
}

export interface FsGalleryUploadConfig extends Omit<IFsFilterFileAction, 'mode'> {
  select: (fsFile: FsFile[] | FsFile) => Observable<any>;
  accept?: string;
  multiple?: boolean;
}

export interface FsGalleryInfoConfig {
  icon?: boolean;
  name?: ((galleryItem: FsGalleryItem) => string) | boolean;
}

export interface FsGalleryDetailsConfig {
  autoOpen?: boolean,
}

export interface Mime {
  type: MimeType,
  extension?: string,
  color?: string,
}

export interface FsGalleryItemAction {
  label: ((galleryItem: FsGalleryItem) => string) | string;
  icon?: string,
  tooltip?: string,
  click?: (galleryItem: FsGalleryItem) => void;
  show?: (galleryItem: FsGalleryItem) => boolean;
  download?: boolean;
  menu?: boolean;
  upload?: {
    select: (galleryItem: FsGalleryItem, file: FsFile | FsFile[]) => void;
    multiple?: boolean;
  };
}

export interface FsGalleryNoResultsConfig extends FsListNoResultsConfig { }

export type FsGalleryConfigFetch = (query?: any, item?: FsGalleryItem) => Observable<FsGalleryItem[]>;

export interface FsGalleryEmptyStateConfig {
  validate: FsGalleryStateValidationFn;
}

export type FsGalleryStateValidationFn = (filters: any, items: unknown[]) => boolean;
