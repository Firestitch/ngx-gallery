import { toString } from 'lodash-es';

export function mime(mapping) {
  let subtype = mapping.mime;

  if(!subtype) {
    const match = ('.'.concat(toString(mapping.url))).toLowerCase().match(/\.([a-z0-9]{3,4})(?=\?|$)/);
    subtype = match ? match[1] : '';

    if(!subtype && mapping.name.indexOf('.') !== false) {
      subtype = mapping.name.split('.').pop();
    }
  }

  let type = 'application';
  if (subtype.match(/(jpe?g|png|gif|tiff?|bmp)/)) {
    type = 'image';
  } else if (subtype.match(/(mov|avi|wmv|flv|3gp|mp4|mpg)/)) {
    type = 'video';
  }

  return { type, subtype };
}
