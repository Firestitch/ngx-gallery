import { FsGalleryItem, FsGalleryItemAction } from '../interfaces';


export function processMenuItems(
  menuItems: FsGalleryItemAction[],
  galleryItem: FsGalleryItem,
): FsGalleryItemAction[] {
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
