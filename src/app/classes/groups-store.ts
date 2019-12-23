import { Group } from '../models/group';
import { FsGalleryItem } from '@firestitch/gallery';

export class GroupsStore {
  private _groups: Group[] = [];
  private _groupsMap = new Map<string | number, Group>();

  constructor() {}

  public get groups() {
    return this._groups;
  }

  public groupByKey(key: string | number) {
    return this._groupsMap.get(key);
  }

  public groupExists(key: string | number) {
    return this._groupsMap.has(key);
  }

  public addGroup(group: Group) {
    this._groups.push(group);
    this._groupsMap.set(group.key, group);
  }

  public addItemForGroup(item: FsGalleryItem[], groupKey: string | number) {
    const group = this._groupsMap.get(groupKey);

    if (group) {
      group.items.push(item);
    }
  }

  public removeGroup(group: Group) {
    if (this._groupsMap.has(group.key)) {
      const index = this._groups.indexOf(group);

      this._groups.splice(index, 1);
      this._groupsMap.delete(group.key);
    }
  }

  public insertAfter(afterGroup: Group, newGroup: Group) {
    if (this._groupsMap.has(afterGroup.key)) {
      const index = this._groups.indexOf(afterGroup);

      this._groups.splice(index + 1, 0, newGroup);
      this._groupsMap.set(newGroup.key, newGroup);
    }
  }

  public clear() {
    this._groups = [];
    this._groupsMap.clear();
  }
}
