import { MimeType } from '../enums';


export function mimeColor(extension: string, folder: boolean): string {
  extension = String(extension);

  switch (extension) {
    case 'pdf':
      return '#D94A53';

    case 'doc':
    case 'docx':
      return '#3097D9';

    case 'xls':
    case 'xlsx':
      return '#6AAA47';

    default:
      if (folder) {
        return '#FFCA28';
      } else if (extension.match(/(jpe?g|png|gif|tiff?|bmp)/i)) {
        return '#a9c51c';
      } else if (extension.match(/(mov|avi|wmv|flv|3gp|mp4|mpg|mp3)/i)) {
        return '#A459AE';
      }
  }

  return null;
}
