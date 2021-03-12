import { delay, filter } from 'rxjs/operators';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout, ViewSize } from '@firestitch/gallery';
import { ItemType } from '@firestitch/filter';

import { of } from 'rxjs';
import { ConfigureComponent } from '../configure/configure.component';
import { clone } from 'lodash-es';
import { FsExampleComponent } from '@firestitch/example';
import { SelectionActionType } from '@firestitch/selection';


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements AfterViewInit {

  @ViewChild(FsGalleryComponent, { static: true })
  public gallery: FsGalleryComponent;
  public reorderEnabled = false;

  public config: FsGalleryConfig = {
    allow: 'image/*, application/pdf, video/*',
    sizeModeDefault: ViewSize.Small,
    // persist: false,
    map: (data) => {
      return {
        name: data.name,
        preview: data.image ? data.image.small : '',
        url: data.image ? data.image.large : data.file,
        index: data.id
      };
    },
    thumbnail: {
      heightScale: 0.674,
      width: 200,
    },
    layout: GalleryLayout.Grid,
    toolbar: true,
    zoom: true,
    info: {
      icon: true,
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
    //showCarousel: false,
    reorderEnd: (data) => {
      console.log(data);
    },
    fetch: (query) => {
      console.log('fetch', query);
      if (!!query.keyword) {
        const filteredItems = this.items.filter((item: any) => {
          return item.name.toLowerCase().includes(query.keyword.toLowerCase())
        });

        return of(filteredItems);

      } else {
        return of(this.items);
      }
    },
    upload: (files) => {
      console.log('uploading...', files);
    },
    previewOpened: (data) => {
      console.log('previewOpened', data);
    },
    previewClosed: (data) => {
      console.log('previewClosed', data);
    },
    previewBeforeOpen: (data) => {
      console.log('previewBeforeOpen', data);
    },
    zoomChanged: (value: number) => {
      console.log('zoomChanged', value);
    }
  };

  constructor(private example: FsExampleComponent) {}

  public items: any[] = [
    {
      id: 1,
      name: 'Scheme',
      description: 'Image 1 description',
      image: {
        small: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 2,
      name: 'Russian Nuclear Station in Pripyat',
      description: 'Image 2 description',
      image: {
        small: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 3,
      name: 'Thunderstorm',
      description: 'Image 3 description',
      image: {
        small: `https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 4,
      name: 'Color Face',
      description: 'Image 4 description',
      image: {
        small: `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 5,
      name: 'Lake',
      description: 'Image 5 description',
      image: {
        small: `https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 6,
      name: 'Lamborghini',
      description: 'Image 6 description',
      image: {
        small: `https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 7,
      name: 'Giraffe',
      description: 'Image 7 description',
      image: {
        small: `https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 8,
      name: 'Document',
      file: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
      description: 'PDF description',
    },
    {
      id: 9,
      name: 'Video',
      file: 'http://techslides.com/demos/sample-videos/small.mp4',
      description: 'Video description',

    },
    {
      id: 10,
      custom: 'html',
      name: 'Custom HTML',
      description: '',
    }
  ];

  ngAfterViewInit() {
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

}
