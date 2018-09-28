import { Component } from '@angular/core';
import { FsGalleryConfig } from '../../../../src';


@Component({
  selector: 'example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {

  public config: FsGalleryConfig = {};

  public items: object[] = [
    {
      id: 1,
      description: 'Image1 description',
      image: {
        small: `https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 2,
      description: 'Image2 description',
      image: {
        small: `https://images.pexels.com/photos/529930/pexels-photo-529930.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/529930/pexels-photo-529930.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 3,
      description: 'Image1 description',
      image: {
        small: `https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 4,
      description: 'Image2 description',
      image: {
        small: `https://images.pexels.com/photos/529930/pexels-photo-529930.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/529930/pexels-photo-529930.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 5,
      description: 'Image1 description',
      image: {
        small: `https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 6,
      description: 'Image2 description',
      image: {
        small: `https://images.pexels.com/photos/529930/pexels-photo-529930.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/529930/pexels-photo-529930.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    }
  ]
}
