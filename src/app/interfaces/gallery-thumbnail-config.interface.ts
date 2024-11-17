import { GalleryObjectFit, ThumbnailScale } from '../enums';

export interface FsGalleryThumbnailConfig {
  styles?: {
    width?: string;
    height?: string;
  },
  heightScale?: number;
  width?: number;
  height?: number;
  objectFit?: GalleryObjectFit;
  position?: string;
  scale?: ThumbnailScale;
}
