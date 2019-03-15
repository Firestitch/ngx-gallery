import { Component, ViewChild } from '@angular/core';

import { FsGalleryComponent, FsGalleryConfig } from '@firestitch/gallery';
import { ItemType } from '@firestitch/filter';

import { of } from 'rxjs';


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  @ViewChild('gallery')
  public gallery: FsGalleryComponent;
  public reorderEnabled = false;

  public config: FsGalleryConfig = {
    filters: [
      {
        name: 'keyword',
        type: ItemType.Text,
        label: 'Search',
        query: 'keyword'
      }
    ],
    draggable: false,
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
    }
  };

/*
  public config: FsGalleryConfig = {
    fetch: () => {
      return of();
    },
    filters: [
      {
        name: 'keyword',
        type: ItemType.Text,
        label: 'Search',
        query: 'keyword'
      }
    ],
    draggable: false,
    upload: (files) => {
      this.items.push(...);
    }
  };
*/


  public items: object[] = [
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
    }
  ];

  public switchOrder() {

    if (this.gallery.isDragEnabled()) {
      this.gallery.disableDrag();
      this.reorderEnabled = false;
    } else {
      this.gallery.enableDrag();
      this.reorderEnabled = true;
    }
  }

  public onReorderImages(data) {
    console.log(data);
  }

}
