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
  allow?: string;
  multiple?: boolean;
  map?: (data: any) => FsGalleryMapping,
  repeat?: boolean;
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
  previewActions?: FsGalleryPreviewAction[],
  previewMenu?: FsGalleryPreviewMenu,
  preview?: boolean,
  zoomChanged?(item: number): any,
  dragName?: string;
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
}

export interface FsGalleryInfoConfig {
  icon?: boolean;
  name?: ((galleryItem: FsGalleryItem) => string) | boolean;
  menu?: FsGalleryInfoMenuConfig;
}

export interface FsGalleryInfoMenuConfig {
  items?: FsGalleryMenuItem[];
}

export interface FsGalleryDetailsConfig {
  autoOpen?: boolean,
}

export interface Mime {
  type: MimeType,
  extension?: string,
  color?: string,
}

export interface FsGalleryPreviewAction extends FsGalleryItemAction {
  icon: string,
  tooltip?: string,
}

export interface FsGalleryPreviewMenu {
  items: FsGalleryMenuItem[],
}

export interface FsGalleryMenuItem extends FsGalleryItemAction {
  label?: ((galleryItem: FsGalleryItem) => string) | string;
}

export interface FsGalleryInfoMenuAction extends FsGalleryItemAction {
  label?: ((galleryItem: FsGalleryItem) => string) | string;
  show?: (galleryItem: FsGalleryItem) => boolean;
}

export interface FsGalleryItemAction {
  click?: (galleryItem: FsGalleryItem) => void;
  show?: (galleryItem: FsGalleryItem) => boolean;
  select?: (galleryItem: FsGalleryItem, file: FsFile | FsFile[]) => void;
  multiple?: boolean;
  download?: boolean;
}

export interface FsGalleryNoResultsConfig extends FsListNoResultsConfig { }

export type FsGalleryConfigFetch = (query?: any, item?: FsGalleryItem) => Observable<FsGalleryItem[]>;

export interface FsGalleryEmptyStateConfig {
  validate: FsGalleryStateValidationFn;
}

export type FsGalleryStateValidationFn = (filters: any, items: unknown[]) => boolean;
