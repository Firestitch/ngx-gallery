import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


import { FsApi } from '@firestitch/api';
import { FsFile } from '@firestitch/file';
import { ItemType } from '@firestitch/filter';
import {
  FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout, MimeType,
} from '@firestitch/gallery';
import { FsPrompt } from '@firestitch/prompt';
import { SelectionActionType } from '@firestitch/selection';

import { Observable, of, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { getItems } from 'playground/app/helpers';


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
  public items: FsGalleryItem[];
  public galleryConfig: FsGalleryConfig;
  public MimeType = MimeType;

  private _destroy$ = new Subject();

  constructor(
    private _prompt: FsPrompt,
    private _api: FsApi,
  ) { 
    this.items = getItems(this._api);
  }

  public ngOnInit(): void {
    this.galleryConfig = {
      showChangeSize: true,
      showChangeView: true,
      thumbnail: {
        // width: 150,
        // height: 100,
        width: 300,
        heightScale: 1.3,
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
      upload: {
        accept: 'image/*, application/pdf, video/*',
        multiple: true,
        select: (files) => {
          console.log('uploading...', files);
          this.items.push({
            guid: 'scheme-1',
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
      itemActions: [
        {
          icon: 'delete_outline',
          label: 'Delete',
          show: () => {
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
          label: 'Re-upload',
          icon: 'upload',
          upload: {
            select: (item: FsGalleryItem, fsFile: FsFile) => {
              console.log(item, fsFile);
            },
          },
        },
        {
          tooltip: 'Download',
          label: 'Download',
          icon: 'download',
          download: true,
        },
        {
          label: 'Menu action',
          click: () => {
            this.gallery.reload();
          },
        },
      ],
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

  public updateDescription(item: FsGalleryItem) {
    console.log(item);
    this.gallery.updateItemData(item, {
      description: 'Updated Description!!!',
    });
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
