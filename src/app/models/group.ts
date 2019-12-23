import { FsGalleryItem } from '@firestitch/gallery';
import { BehaviorSubject } from 'rxjs';


export class Group {
  public items: FsGalleryItem[] = [];

  private _expanded = new BehaviorSubject<boolean>(true);

  constructor(
    public name: string,
    private _key: string | number,
    private _locked = false,
    private _data: any = void 0) {
  }

  get expanded$() {
    return this._expanded.asObservable();
  }

  get expanded() {
    return this._expanded.getValue();
  }

  get key() {
    return this._key;
  }

  get data() {
    return this._data;
  }

  get locked() {
    return this._locked;
  }

  set expanded(value: boolean) {
    this._expanded.next(value);
  }

  public addItem(item: FsGalleryItem) {
    this.items.push(item);
  }

  public toggleExpanded() {
    this._expanded.next(!this.expanded);
  }
}
