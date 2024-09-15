import { FsApi } from '@firestitch/api';
import { FsGalleryItem } from '@firestitch/gallery';

export function getItems(api: FsApi): FsGalleryItem[] {
  return [
    {
      data: {
        id: 1,
        description: 'Image 1 description',
      },
      name: 'Scheme',
      preview: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      url: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      data: {
        id: 2,
        description: 'Image 2 description',
      },
      name: 'Russian Nuclear Station in Pripyat',
      preview: 'https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      url: 'https://images.pexels.com/photos/55830/power-plant-control-room-electric-old-55830.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      data: {
        id: 3,
        description: 'Image 3 description',
      },
      name: 'Thunderstorm',
      preview: 'https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      url: 'https://images.pexels.com/photos/371916/pexels-photo-371916.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      data: {
        id: 4,
        description: 'Image 4 description',
      },
      name: 'Color Face',
      preview: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      url: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      data: {
        id: 5,
        description: 'Image 5 description',
      },
      name: 'Lake',
      preview: 'https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      url: 'https://images.pexels.com/photos/547119/pexels-photo-547119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      data: {
        id: 6,
        description: 'Image 6 description',
      },
      name: 'Lamborghini',
      preview: 'https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      url: 'https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      data: {
        id: 7,
        description: 'Image 7 description',
      },
      name: 'Giraffe',
      preview: 'https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      url: 'https://images.pexels.com/photos/1210642/pexels-photo-1210642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      data: {
        id: 8,
        description: 'PDF description',
      },
      name: 'pdf-sample.pdf',
      preview: 'https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      url: api.createApiFile('/assets/pdf-sample.pdf'),
    },
    {
      data: {
        id: 55,
        description: 'Image',
      },
      preview: api.createApiFile('/assets/car.jpg'),
      url: api.createApiFile('/assets/car.jpg'),
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
        },
      ],
    },
  ];
}
