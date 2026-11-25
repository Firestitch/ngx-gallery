import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';
import { FilterConfig, FsFilterAction, IFilterConfigItem, IFsFilterFileAction } from '@firestitch/filter';
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
  filterConfig?: FilterConfig;
  upload?: FsGalleryUploadConfig;
  emptyState?: FsGalleryEmptyStateConfig;
  fetch?: FsGalleryConfigFetch;
  filters?: IFilterConfigItem[];
  actions?: FsFilterAction[];
  selection?: FsListSelectionConfig;
  zoom?: boolean;
  loadMore?: FsGalleryLoadMoreConfig | boolean;
  reorder?: {
    enabled?: boolean,
    end?(data: any): any,
    start?(event: { 
      item: FsGalleryItem;
       el: any; 
       source: any, 
       handle: any, 
       sibling: any
      }): boolean,
  },
  previewBeforeOpen?(galleryItem: FsGalleryItem): Observable<FsGalleryItem>,
  previewOpened?(galleryItem: FsGalleryItem): any,
  previewClick?(galleryItem: FsGalleryItem): any,
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
  guid: string,
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
  width?: number,
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

/**
 * A page at a time, as the list's Load More, whose settings these are (the list
 * does not export their interface): the first fetch asks for `limit` items
 * (`offset` 0), and each click of the button below the thumbnails the next
 * `limit`, while more remain.
 */
export interface FsGalleryLoadMoreConfig {
  enabled?: boolean;
  label?: string;
  buttonColor?: 'primary' | 'accent' | 'warn';
  buttonType?: 'flat' | 'raised' | 'stroked' | 'basic';
  limit?: number;
}

/**
 * A fetch's answer: the items, or the items with how many the query matches in
 * all (`paging.records`), which tells Load More when the last page is in.
 * Without it, more remain while a page comes back full.
 */
export interface FsGalleryFetchResult {
  data: FsGalleryItem[];
  paging?: { records?: number };
}

export type FsGalleryConfigFetch = (query?: any, item?: FsGalleryItem) => Observable<FsGalleryItem[] | FsGalleryFetchResult>;

export interface FsGalleryEmptyStateConfig {
  validate: FsGalleryStateValidationFn;
}

export type FsGalleryStateValidationFn = (filters: any, items: unknown[]) => boolean;
