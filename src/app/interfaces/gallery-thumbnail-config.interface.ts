import { GalleryThumbnailSize, ThumbnailScale } from '../enums';

export interface FsGalleryThumbnailConfig {
  styles?: {
    width?: string;
    height?: string;
  },
  heightScale?: number;
  width?: number;
  height?: number;
  size?: GalleryThumbnailSize;
  position?: string;
  scale?: ThumbnailScale;
}
