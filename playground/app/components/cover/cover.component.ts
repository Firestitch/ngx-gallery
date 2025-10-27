import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';


import { FsApi } from '@firestitch/api';
import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, MimeType } from '@firestitch/gallery';

import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { getItems } from 'playground/app/helpers';
import { GalleryObjectFit } from 'src/app/enums';
import { FsGalleryComponent as FsGalleryComponent_1 } from '../../../../src/app/components/gallery/gallery.component';


@Component({
    selector: 'app-cover',
    templateUrl: './cover.component.html',
    styleUrls: ['./cover.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsGalleryComponent_1],
})
export class CoverComponent implements OnInit, OnDestroy {
  private _api = inject(FsApi);


  @ViewChild(FsGalleryComponent, { static: true })
  public gallery: FsGalleryComponent;

  public reorderEnabled = false;
  public items: FsGalleryItem[];
  public galleryConfig: FsGalleryConfig;
  public MimeType = MimeType;

  private _destroy$ = new Subject();

  constructor() { 
    this.items = getItems(this._api);
  }

  public ngOnInit(): void {
    this.galleryConfig = {
      showChangeSize: true,
      showChangeView: true,
      reload: false,
      thumbnail: {
        width: 250,
        heightScale: .7,
        objectFit: GalleryObjectFit.Cover,
      },
      fetch: (query, galleryItem: FsGalleryItem): Observable<FsGalleryItem[]> => {
        console.log('fetch', query);
        let items = this.items;

        if (galleryItem) {
          items = galleryItem.items;
        }

        if (query.keyword) {
          items = items.filter((item: any) => {
            return item.name?.toLowerCase().includes(query.keyword.toLowerCase());
          });
        }

        return of(items)
          .pipe(
            delay(100),
          );
      },
      reorder: {
        enabled: true,
        end: (data) => {
          console.log('reorderEnd', data);
        },
        start: ({ item, el, source, handle, sibling }) => {
          console.log('reorderStart', item, el, source, handle, sibling);

          return true;
        },
      },
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
