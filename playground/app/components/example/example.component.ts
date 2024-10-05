import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


import { FsApi } from '@firestitch/api';
import { FsFile } from '@firestitch/file';
import { ItemType } from '@firestitch/filter';
import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout, MimeType } from '@firestitch/gallery';
import { FsPrompt } from '@firestitch/prompt';
import { SelectionActionType } from '@firestitch/selection';

import { Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { getItems } from 'playground/app/helpers';
import { GalleryThumbnailSize } from 'src/app/enums';


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit, OnDestroy {

  @ViewChild(FsGalleryComponent, { static: true })
  public gallery: FsGalleryComponent;

  public reorderEnabled = false;
  public items = getItems(this._api);
  public galleryConfig: FsGalleryConfig;
  public MimeType = MimeType;

  private _destroy$ = new Subject();

  constructor(
    private _prompt: FsPrompt,
    private _api: FsApi,
  ) { }

  public ngOnInit(): void {
    this.galleryConfig = {
      showChangeSize: true,
      showChangeView: true,
      allow: 'image/*, application/pdf, video/*',
      multiple: true,
      thumbnail: {
        //height: 100,
        width: 100,
        heightScale: 1,
        size: GalleryThumbnailSize.Cover,
      },
      emptyState: {
        validate: (query, items) => {
          return items.length === 0;
        },
      },
      details: {
        autoOpen: true,
      },
      layout: GalleryLayout.Flow,
      zoom: true,
      info: {
        name: true,
        icon: true,
        menu: {
          items: [
            {
              label: (item: FsGalleryItem) => {
                return `Info ${item.data?.description}`;
              },
              click: (item: any) => {
                console.log(item);
              },
            },
            {
              label: 'Delete',
              click: (item: any) => {
                console.log(item);
              },
            },
            {
              label: 'Download',
              click: (item: any) => {
                window.open(item.image.large);
              },
              show: () => {
                return true; 
              },
            },
            {
              label: 'Upload',
              select: (item: FsGalleryItem, fsFile) => {
                console.log(item, fsFile);
              },
            },
          ],
        },
      },
      actions: [
        {
          label: 'Export',
          primary: false,
          click: () => {
            console.log('Export');
          },
          show: () => {
            return false;
          },
        },
      ],
      selection: {
        selectAll: true,
        actions: [
          {
            type: SelectionActionType.Action,
            name: 'delete',
            label: 'Delete',
          },
          {
            type: SelectionActionType.Select,
            label: 'Change Status To',
            values: [
              {
                name: 'TODO',
                value: '1',
              },
              {
                name: 'Done',
                value: '2',
              },
            ],
          },
        ],
        actionSelected: (action) => {
          console.log(action);

          return of(true).pipe(
            delay(2000),
          );
        },
        allSelected: () => {
          //
        },
        cancelled: () => {
          //
        },
        selectionChanged: (data, allSelected, selectionRef) => {
          if (data.find((row) => row.name === 'Object 1')) {
            return of([
              {
                type: SelectionActionType.Action,
                value: 'custom',
                label: 'Custom Action',
              },
            ]);
          } 
          if (selectionRef) {
            selectionRef.resetActions();
          }
          
        },
      },
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },

        {
          name: 'select',
          type: ItemType.Select,
          label: 'Select',
          values: () => {
            return [{ name: 'Name', value: 'value' }];
          },
        },
      ],
      reorderEnd: (data) => {
        console.log('reorderEnd', data);
      },
      reorderStart: ({ item, el, source, handle, sibling }) => {
        console.log('reorderStart', item, el, source, handle, sibling);

        return true;
      },
      fetch: (query, galleryItem: FsGalleryItem): Observable<FsGalleryItem[]> => {
        console.log('fetch', query);
        let items = this.items;

        if (galleryItem) {
          items = galleryItem.items;
        }

        if (query.keyword) {
          items = items.filter((item: any) => {
            return item.name.toLowerCase().includes(query.keyword.toLowerCase());
          });
        }

        return of(items)
          .pipe(
            delay(100),
          );
      },
      upload: {
        select: (files) => {
          console.log('uploading...', files);
          this.items.push({
            data: {
              id: 1,
              description: 'Image 1 description',
            },
            name: 'Scheme',
            preview: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            url: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
          });

          return of(true);
        },
      },
      previewActions: [
        {
          icon: 'delete_outline',
          show: (item: FsGalleryItem) => {
            return true;
          },
          click: (item: FsGalleryItem) => {
            console.log('Delete Click');
            this._prompt.confirm({
              title: 'Delete File',
              template: 'Are you sure you would like the the file?',
            })
              .pipe(
                takeUntil(this._destroy$),
              )
              .subscribe(() => {
                this.items = this.items
                  .filter((_item) => {
                    return _item.data.id !== item.data.id;
                  });

                this.gallery.reload();
                this.gallery.galleryService.closePreview();
              });
          },
          tooltip: 'Delete',
        },
        {
          tooltip: 'Re-upload',
          icon: 'upload',
          select: (item: FsGalleryItem, fsFile: FsFile) => {
            console.log(item, fsFile);
          },
        },
        {
          tooltip: 'Download',
          icon: 'download',
          download: true,
        },
      ],
      previewMenu: {
        items: [
          {
            label: 'Settings',
            click: (item: FsGalleryItem) => {
              console.log('Settings Click');
            },
          },
          {
            label: (item) => {
              return 'Delete';
            },
            click: (item: FsGalleryItem) => {
              console.log('Delete Click');
            },
          },
          {
            label: (item) => {
              return 'Re-upload';
            },
            select: (item: FsGalleryItem, fsFile: FsFile) => {
              console.log(item, fsFile);
            },
          },
        ],
      },
      previewOpened: (data) => {
        console.log('previewOpened', data);
      },
      previewClosed: (data) => {
        console.log('previewClosed', data);
      },
      previewBeforeOpen: (data: FsGalleryItem) => {
        console.log('previewBeforeOpen', data);

        return of(data);
      },
      zoomChanged: (value: number) => {
        console.log('zoomChanged', value);
      },
    };
  }

  public switchOrder() {
    if (this.gallery.isReorderEnabled()) {
      this.gallery.disableReorder();
      this.reorderEnabled = false;
    } else {
      this.gallery.enableReorder();
      this.reorderEnabled = true;
    }
  }

  public onReorderImages(data) {
    console.log(data);
  }

  public previewOpened() {
    console.log('preview Opened');
  }

  public previewClosed() {
    console.log('preview Closed');
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
