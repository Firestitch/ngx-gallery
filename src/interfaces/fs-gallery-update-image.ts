import { FsFile } from '@firestitch/file';
import { FsGalleryDataItem } from './fs-gallery-data-item';


export interface FsGalleryUpdateImage {
  data: FsGalleryDataItem;
  file: FsFile;
}
