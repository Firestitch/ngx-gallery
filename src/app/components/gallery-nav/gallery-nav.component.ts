import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryService } from '../../services/gallery.service';


@Component({
  selector: 'fs-gallery-nav',
  templateUrl: './gallery-nav.component.html',
  styleUrls: ['./gallery-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsGalleryNavComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  constructor(
    public galleryService: FsGalleryService,
    public _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.galleryService.data$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._cdRef.markForCheck();
      });
  }

  public navClick(item) {
    const index = this.galleryService.navItems.indexOf(item);
    this.galleryService.navItems = index === -1 ? [] : this.galleryService.navItems.splice(index);
    this.galleryService.loadGallery();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
