import { delay, takeUntil } from 'rxjs/operators';
import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout, MimeType, ThumbnailScale } from '@firestitch/gallery';
import { ItemType } from '@firestitch/filter';

import { Observable, of, Subject } from 'rxjs';
import { ConfigureComponent } from '../configure/configure.component';
import { clone } from 'lodash-es';
import { FsExampleComponent } from '@firestitch/example';
import { SelectionActionType } from '@firestitch/selection';
import { GalleryThumbnailSize } from 'src/app/enums';
import { FsPrompt } from '@firestitch/prompt';
import { getItems } from 'playground/app/helpers';


@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss'],
})
export class CoverComponent implements OnInit, OnDestroy {

  @ViewChild(FsGalleryComponent, { static: true })
  public gallery: FsGalleryComponent;

  public reorderEnabled = false;
  public items = getItems();
  public galleryConfig: FsGalleryConfig;
  public MimeType = MimeType;

  private _destroy$ = new Subject();

  constructor(
  ) { }

  public ngOnInit(): void {
    this.galleryConfig = {
      showChangeSize: true,
      showChangeView: true,
      thumbnail: {
        width: 250,
        heightScale: .7,
        size: GalleryThumbnailSize.Cover,
      },
      fetch: (query, item: FsGalleryItem): Observable<FsGalleryItem[]> => {
        console.log('fetch', query);
        let items = this.items;

        if (item) {
          items = item.items;
        }

        if (!!query.keyword) {
          items = items.filter((item: any) => {
            return item.name.toLowerCase().includes(query.keyword.toLowerCase())
          });
        }

        return of(items)
          .pipe(
            delay(100),
          );
      },
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
