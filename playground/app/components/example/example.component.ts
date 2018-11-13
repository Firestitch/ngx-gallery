import { Component } from '@angular/core';
import { FsGalleryConfig } from '../../../../src';


@Component({
  selector: 'example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {

  public config: FsGalleryConfig = { draggable: false, updateImage: true, addImage: true };

  public items: object[] = [
    {
      id: 1,
      description: 'Image 1 description',
      image: {
        small: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 2,
      description: 'Image 2 description',
      image: {
        small: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 3,
      description: 'Image 3 description',
      image: {
        small: `https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 4,
      description: 'Image 4 description',
      image: {
        small: `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 5,
      description: 'Image 5 description',
      image: {
        small: `https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 6,
      description: 'Image 6 description',
      image: {
        small: `https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    },
    {
      id: 7,
      description: 'Image 7 description',
      image: {
        small: `https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
        large: `https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`
      }
    }
  ]

  public switchOrder() {
    this.config.draggable = !this.config.draggable;
  }

  public switchUpdateImage() {
    this.config.updateImage = !this.config.updateImage;
  }

  public onUpdateImage(data) {
    console.log(data);
  }

  public onAddImage(data) {
    console.log(data);
  }

}
