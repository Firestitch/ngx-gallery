import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


import { FsApi } from '@firestitch/api';
import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, MimeType } from '@firestitch/gallery';

import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { getItems } from 'playground/app/helpers';
import { GalleryObjectFit } from 'src/app/enums';


@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverComponent implements OnInit, OnDestroy {

  @ViewChild(FsGalleryComponent, { static: true })
  public gallery: FsGalleryComponent;

  public reorderEnabled = false;
  public items: FsGalleryItem[];
  public galleryConfig: FsGalleryConfig;
  public MimeType = MimeType;

  private _destroy$ = new Subject();

  constructor(
    private _api: FsApi,
  ) { 
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
