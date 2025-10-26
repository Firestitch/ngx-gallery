import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { CdkDragDrop, CdkDragStart, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryItem } from '../../interfaces/gallery-config.interface';
import { FsGalleryService } from '../../services/gallery.service';
import { FsGalleryThumbnailComponent } from '../gallery-thumbnail/gallery-thumbnail.component';
import { NgTemplateOutlet } from '@angular/common';


@Component({
    selector: 'fs-gallery-gallery-view',
    templateUrl: './gallery-view.component.html',
    styleUrls: ['./gallery-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CdkDropList,
        FsGalleryThumbnailComponent,
        CdkDrag,
        NgTemplateOutlet,
    ],
})
export class FsGalleryViewComponent implements AfterViewInit, OnInit, OnDestroy {

  @Input()
  public reorderEnabled: boolean;

  public reorderable: boolean;
  public data: FsGalleryItem[];

  @Output()
  public orderChange = new EventEmitter<FsGalleryItem[]>();
  
  private _elRef = inject(ElementRef);
  private _cdRef = inject(ChangeDetectorRef);
  private _destroy$ = new Subject<void>();

  constructor(
    public galleryService: FsGalleryService,
  ) { 
    this.reorderable = this.galleryService.config.reorderable;
  }

  public ngOnInit(): void {
    this.galleryService.data$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((data) => {
        this.data = data;
        this._cdRef.markForCheck();
      });
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

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
