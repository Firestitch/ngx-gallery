import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig, FsGalleryItem, GalleryLayout } from '@firestitch/gallery';
import { ItemType } from '@firestitch/filter';

import { of, timer } from 'rxjs';
import { ConfigureComponent } from '../configure/configure.component';
import { clone } from 'lodash-es';
import { FsExampleComponent } from '@firestitch/example';
import { map } from 'rxjs/operators';


@Component({
  selector: 'groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements AfterViewInit {

  @ViewChild('gallery', { static: true })
  public gallery: FsGalleryComponent;
  public reorderEnabled = false;

  public config: FsGalleryConfig = {
    allowedFiles: 'image/*, application/pdf, video/*',
    fileField: 'file',
    nameField: 'name',
    imageField: 'image.large',
    thumbnailField: 'image.small',
    imageHeightScale: 0.674,
    imageWidth: 200,
    layout: GalleryLayout.Grid,
    toolbar: true,
    zoom: true,
    group: {
      groups: [
        {
          title: 'Group 1',
          id: 1,
        },
        {
          title: 'Group 2',
          id: 2,
        },
        {
          title: 'Group 3',
          id: 3,
        },
      ],
      groupTrackBy: (group => group.id),
      groupWith: (item) => {
        return item.group_id;
      },
      nameValue: ({ title }) => {
        return title
      },
      added: (name) => {
        return timer(2000).pipe(
          map(() => {
            return {
              title: name,
              id: 4,
            };
          })
        )
      },
      changed: (group, items) => {
        console.log(group, items);

        return timer(2000);
      },
      deleted: (group, items) => {
        console.log(group, items);

        return timer(2000);
      }
    },
    info: {
      icon: true,
      menu: {
        actions: [
          {
            label: 'Info',
            click: (item: FsGalleryItem) => {
              console.log(item);
            }
          },
          {
            label: 'Delete',
            click: (item: FsGalleryItem) => {
              console.log(item);
            }
          },
          {
            label: 'Download',
            click: (item: FsGalleryItem) => {
              window.open(item.image.large);
            }
          }
        ]
      }
    },
    filters: [
      {
        name: 'keyword',
        type: ItemType.Text,
        label: 'Search',
        query: 'keyword'
      }
    ],
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
    }
  };

  constructor(private example: FsExampleComponent) {}

  public items: FsGalleryItem[] = [
    {
      id: 1,
      name: 'Scheme',
      description: 'Image 1 description',
      group_id: 1,
      image: {
        small: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 2,
      name: 'Russian Nuclear Station in Pripyat',
      description: 'Image 2 description',
      group_id: 2,
      image: {
        small: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 3,
      name: 'Thunderstorm',
      description: 'Image 3 description',
      group_id: 2,
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
      group_id: 3,
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
