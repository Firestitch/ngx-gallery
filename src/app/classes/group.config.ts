import {
  FsGalleryGroupAddedFn,
  FsGalleryGroupChangedFn,
  FsGalleryGroupConfig,
  FsGalleryGroupDeletedFn,
  FsGalleryGroupTrackByFn,
  FsGalleryGroupWithFn,
  FsGalleryNameValueFn,
} from '../interfaces/gallery-config.interface';

export class GalleryGroupConfig {
  public groups: string[] = [];

  public groupWith: FsGalleryGroupWithFn;
  public nameValue: FsGalleryNameValueFn;
  public groupTrackBy: FsGalleryGroupTrackByFn;
  public groupDeleted: FsGalleryGroupDeletedFn;
  public groupChanged: FsGalleryGroupChangedFn;
  public addGroup: FsGalleryGroupAddedFn;

  constructor(data: FsGalleryGroupConfig) {
    this._initGroup(data);
  }

  private _initGroup(group: FsGalleryGroupConfig) {
    this.groups = [...group.groups];

    this.groupWith = group.groupWith;
    this.nameValue = group.nameValue;
    this.groupTrackBy = group.groupTrackBy;
    this.groupDeleted = group.deleted;
    this.groupChanged = group.changed;
    this.addGroup = group.added;
  }
}
