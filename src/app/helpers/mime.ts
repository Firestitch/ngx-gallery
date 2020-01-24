import { toString } from 'lodash-es';


export function mime(value) {

  const match = ('.'.concat(toString(value))).toLowerCase().match(/\.([a-z0-9]{3,4})(?=\?|$)/);
  const subtype = match ? match[1] : '';

  let type = 'application';

  if (subtype.match(/(jpe?g|png|gif|tiff?|bmp)/)) {
    type = 'image';
  } else if (subtype.match(/(mov|avi|wmv|flv|3gp|mp4|mpg)/)) {
    type = 'video';
  }

  return { type: type, subtype: subtype };
}
