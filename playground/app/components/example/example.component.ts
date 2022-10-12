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


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(FsGalleryComponent, { static: true })
  public gallery: FsGalleryComponent;

  public reorderEnabled = false;
  //public items = [];
  public items = this.getDefaultItems();
  public galleryConfig: FsGalleryConfig;
  public MimeType = MimeType;

  private _destroy$ = new Subject();

  constructor(
    private example: FsExampleComponent,
    private _prompt: FsPrompt,
  ) { }

  public ngOnInit(): void {
    this.galleryConfig = {
      // showChangeSize: false,
      // showChangeView: false,
      // showCarousel: false,
      allow: 'image/*, application/pdf, video/*',
      multiple: true,
      thumbnail: {
        height: 180,
        size: GalleryThumbnailSize.Contain,
      },
      // thumbnail: {
      //   width: 250,
      //   heightScale: .5,
      //   size: GalleryThumbnailSize.Cover,
      // },
      details: {
        autoOpen: true,
      },
      layout: GalleryLayout.Flow,
      zoom: true,
      info: {
        menu: {
          actions: [
            {
              label: 'Info',
              click: (item: any) => {
                console.log(item);
              }
            },
            {
              label: 'Delete',
              click: (item: any) => {
                console.log(item);
              }
            },
            {
              label: 'Download',
              click: (item: any) => {
                window.open(item.image.large);
              }
            }
          ]
        }
      },
      actions: [
        {
          label: 'Export',
          primary: false,
          click: () => {
            console.log('Export');
          },
        }
      ],
      selection: {
        selectAll: true,
        actions: [
          {
            type: SelectionActionType.Action,
            name: 'delete',
            label: 'Delete'
          },
          {
            type: SelectionActionType.Select,
            label: 'Change Status To',
            values: [
              {
                name: 'TODO',
                value: '1'
              },
              {
                name: 'Done',
                value: '2'
              }
            ]
          },
        ],
        actionSelected: (action) => {
          console.log(action);

          return of(true).pipe(
            delay(2000),
          )
        },
        allSelected: () => {
        },
        cancelled: () => {
        },
        selectionChanged: (data, allSelected, selectionRef) => {
          if (data.find((row) => row.name === 'Object 1')) {
            return of([
              {
                type: SelectionActionType.Action,
                value: 'custom',
                label: 'Custom Action'
              },
            ])
          } else {
            if (selectionRef) {
              selectionRef.resetActions();
            }
          }
        }
      },
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        },

        {
          name: 'select',
          type: ItemType.Select,
          label: 'Select',
          values: () => {
            return [{ name: 'Name', value: 'value' }];
          }
        }
      ],
      reorderEnd: (data) => {
        console.log('reorderEnd', data);
      },
      reorderStart: ({ item, el, source, handle, sibling }) => {
        console.log('reorderStart', item, el, source, handle, sibling);
        return true;
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
      upload: (files) => {
        console.log('uploading...', files);
        this.items.push({
          data: {
            id: 1,
            description: 'Image 1 description',
          },
          name: 'Scheme',
          preview: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
          url: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
        });

        return of(true);
      },
      previewActions: [
        {
          icon: 'delete_outline',
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
          }
        }
      ],
      previewMenu: {
        items: [
          {
            label: 'Settings',
            click: (item: FsGalleryItem) => {
              console.log('Settings Click');
            }
          }
        ]
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
      }
    };
  }

  public ngAfterViewInit() {
    this.example.setConfigureComponent(ConfigureComponent, {
      config: this.gallery.config,
      defaultConfig: clone(this.gallery.config),
      galleryService: this.gallery.galleryService
    });
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

  public getDefaultItems(): FsGalleryItem[] {
    return [
      {
        data: {
          id: 1,
          description: 'Image 1 description',
        },
        name: 'Scheme',
        preview: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        url: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      },
      {
        data: {
          id: 2,
          description: 'Image 2 description',
        },
        name: 'Russian Nuclear Station in Pripyat',
        preview: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        url: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      },
      {
        data: {
          id: 3,
          description: 'Image 3 description',
        },
        name: 'Thunderstorm',
        preview: `https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        url: `https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      },
      {
        data: {
          id: 4,
          description: 'Image 4 description',
        },
        name: 'Color Face',
        preview: `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        url: `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      },
      {
        data: {
          id: 5,
          description: 'Image 5 description',
        },
        name: 'Lake',
        preview: `https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        url: `https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      },
      {
        data: {
          id: 6,
          description: 'Image 6 description',
        },
        name: 'Lamborghini',
        preview: `https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        url: `https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      },
      {
        data: {
          id: 7,
          description: 'Image 7 description',
        },
        name: 'Giraffe',
        preview: `https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        url: `https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      },
      {
        data: {
          id: 8,
          description: 'PDF description',
        },
        name: 'Document',
        url: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
      },
      {
        data: {
          id: 9,
          description: 'Video description',
        },
        name: 'Video',
        url: 'http://techslides.com/demos/sample-videos/small.mp4',
      },
      {
        data: {
          id: 10,
          custom: 'html',
          description: '',
        },
        name: 'Custom Name',
      },
      {
        data: {
          id: 11,
          description: '',
        },
        name: 'Folder A',
        folder: true,
        items: [
          {
            name: 'Huangpu Qu, Shanghai Shi, China',
            preview: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            url: 'https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          }
        ]
      }
    ];
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
