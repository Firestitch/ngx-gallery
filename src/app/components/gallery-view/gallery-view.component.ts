import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';

import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';

import { Observable } from 'rxjs';

import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { FsGalleryService } from '../../services/gallery.service';


@Component({
  selector: 'fs-gallery-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryViewComponent implements AfterViewInit {

  @Input()
  public data$: Observable<FsGalleryItem[]>;

  @Input()
  public reorderEnabled: boolean;

  public reorderable: boolean;

  @Output()
  public orderChange = new EventEmitter<FsGalleryItem[]>();
  
  private _elRef = inject(ElementRef);

  constructor(
    public galleryService: FsGalleryService,
  ) { 
    this.reorderable = this.galleryService.config.reorderable;
  }

  public moved(event: CdkDragDrop<FsGalleryItem[], FsGalleryItem[], FsGalleryItem>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    this.orderChange.emit(event.container.data);
  }

  public ngAfterViewInit() {
    this._elRef.nativeElement.style
      .setProperty('--gallery-thumbnail-width', `${this.galleryService.config.thumbnail.width}px`);
    this._elRef.nativeElement.style
      .setProperty('--gallery-thumbnail-height-scale', `${this.galleryService.config.thumbnail.heightScale}`);
  }

  public dragStarted(event: CdkDragStart<FsGalleryItem>) {
    this.galleryService.config.reorderStart({
      item: event.source.data,
      el: event.source.element.nativeElement,
      source: event.event,
    });
  }

}
