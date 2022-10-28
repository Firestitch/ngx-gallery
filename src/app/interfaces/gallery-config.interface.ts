import { FsGalleryThumbnailConfig } from './gallery-thumbnail-config.interface';
import { Observable } from 'rxjs';
import { GalleryLayout } from '../enums/gallery-layout.enum';
import { FsFilterAction, IFilterConfigItem } from '@firestitch/filter';
import { FsListNoResultsConfig, FsListSelectionConfig } from '@firestitch/list';
import { FsGalleryPersistance } from './gallery-persist-config.interface';
import { MimeType } from '../enums';


export interface FsGalleryConfig {
  allow?: string;
  multiple?: boolean;
  map?: (data: any) => FsGalleryMapping,
  repeat?: boolean;
  draggable?: boolean;
  layout?: GalleryLayout;
  showChangeSize?: boolean;
  showChangeView?: boolean;
  filter?: any;
  upload?: (query) => Observable<any>;
  fetch?: FsGalleryConfigFetch;
  filters?: IFilterConfigItem[];
  actions?: FsFilterAction[];
  selection?: FsListSelectionConfig;
  zoom?: boolean;
  reorderEnd?(data: any): any,
  reorderStart?(event: { item: FsGalleryItem; el: any; source: any, handle: any, sibling: any }): boolean,
  previewBeforeOpen?(item: FsGalleryItem): Observable<FsGalleryItem>,
  previewOpened?(item: FsGalleryItem): any,
  previewClosed?(item: FsGalleryItem): any,
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
  preview?: string,
  previewMedium?: string,
  previewLarge?: string,
  url?: string,
  extension?: string,
  folder?: boolean,
}

export interface FsGalleryItem extends FsGalleryMapping {
  data?: any,
  items?: FsGalleryItem[],
  mime?: Mime,
  index?: number,
  contains?: FsGalleryItemContains,
}

export interface FsGalleryItemContains {
  folders?: number;
  files?: number;
  mimeTypes?: { [mimeType in MimeType]?: number };
}

export interface FsGalleryInfoConfig {
  icon?: boolean;
  name?: boolean;
  menu?: FsGalleryInfoMenuConfig;
}

export interface FsGalleryInfoMenuConfig {
  actions?: FsGalleryInfoMenuActionConfig[];
}

export interface FsGalleryDetailsConfig {
  autoOpen?: boolean,
}

export interface FsGalleryInfoMenuActionConfig {
  label?: ((item: FsGalleryItem) => string) | string;
  click?(item: FsGalleryItem): any;
  show?: (item: FsGalleryItem) => boolean;
}

export interface Mime {
  type: MimeType,
  extension?: string,
  color?: string,
}

export interface FsGalleryPreviewAction {
  icon: string,
  click?: (item: FsGalleryItem) => void,
  show?: (item: FsGalleryItem) => boolean,
}

export interface FsGalleryPreviewMenu {
  items: FsGalleryPreviewMenuItem[],
}

export interface FsGalleryPreviewMenuItem {
  label: string,
  click?: (item: FsGalleryItem) => void,
}

export interface FsGalleryNoResultsConfig extends FsListNoResultsConfig { }

export type FsGalleryConfigFetch = (query?: any, item?: FsGalleryItem) => Observable<FsGalleryItem[]>; 