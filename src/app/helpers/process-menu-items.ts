import { FsGalleryItem, FsGalleryMenuItem } from '../interfaces';


export function processMenuItems(menuItems: FsGalleryMenuItem[], galleryItem: FsGalleryItem): FsGalleryMenuItem[] {
  return menuItems
    .filter((item) => {
      return !item.show || item.show(galleryItem);
    })
    .map((action) => {
      const label = action.label instanceof Function ?
        action.label(galleryItem) : action.label;

      return {
        ...action,
        label,
      };
    });
}
