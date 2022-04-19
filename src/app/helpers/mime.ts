
export function mime(name: string, url: string) {
  name = String(name);
  url = String(url);

  let subtype = null;
  const nameMatch = url.match(/\.([^\.]{3,4})$/);
  if(nameMatch) {
    subtype = nameMatch[1];
  }
  
  const urlMatch = url.match(/\.([^\.]{3,4})(?=\?|$)/);
  if(urlMatch) {
    subtype = urlMatch[1];
  }

  let type = 'application';
  if(subtype) {
    if (subtype.match(/(jpe?g|png|gif|tiff?|bmp)/i)) {
      type = 'image';
    } else if (subtype.match(/(mov|avi|wmv|flv|3gp|mp4|mpg)/i)) {
      type = 'video';
    }
  }

  return { type, subtype };
}
