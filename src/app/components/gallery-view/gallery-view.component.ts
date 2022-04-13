import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { FsGalleryService } from '../../services/gallery.service';

import { GalleryConfig } from '../../classes/gallery.config';
import { FsGalleryItem } from '../../interfaces/gallery-config.interface';


@Component({
  selector: 'fs-gallery-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: [ './gallery-view.component.scss' ]
})
export class FsGalleryViewComponent {

  @Input()
  public data$: BehaviorSubject<FsGalleryItem[]>;

  @Input()
  public reorderEnabled;

  @Input()
  public galleryConfig: GalleryConfig;

  @Output() 
  public orderChange = new EventEmitter<FsGalleryItem[]>();

  constructor(
    public galleryService: FsGalleryService,
  ) {
  }

}
