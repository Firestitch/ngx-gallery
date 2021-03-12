export interface FsGalleryPersistanceConfig {
  name?: string;
  timeout?: number;
}

export type FsGalleryPersistance = boolean | FsGalleryPersistanceConfig;
