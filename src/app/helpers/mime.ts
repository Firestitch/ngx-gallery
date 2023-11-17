import { FsApiFile } from '@firestitch/api';
import { MimeType } from '../enums';
import { mimeColor } from './mime-color';


export function mime(name: string, url: string | FsApiFile, extension: string, folder: boolean): { type: MimeType, extension: string, color: string } {
  if (!extension) {
    if (typeof url === 'string') {
      const urlMatch = String(url).match(/\.([^\.]{3,4})(?=\?|$)/);
      if (urlMatch) {
        extension = urlMatch[1];
      }
    } else if (url instanceof FsApiFile) {
      const urlMatch = String(url.name).match(/\.([^\.]{3,4})(?=\?|$)/);
      if (urlMatch) {
        extension = urlMatch[1];
      }
    }
  }

  if (!extension) {
    const nameMatch = String(name).match(/\.([^\.]{3,4})$/);
    if (nameMatch) {
      extension = nameMatch[1];
    }
  }

  let type = null;
  if (extension) {
    if (extension.match(/(jpe?g|png|gif|tiff?|bmp)/i)) {
      type = MimeType.Image;
    } else if (extension.match(/(mov|avi|wmv|flv|3gp|mp4|mpg)/i)) {
      type = MimeType.Video;
    } else if (extension.match(/(mp3)/i)) {
      type = MimeType.Audio;
    } else {
      type = MimeType.Application;
    }
  }

  const color = mimeColor(extension, folder);

  return { type, extension, color };
}
