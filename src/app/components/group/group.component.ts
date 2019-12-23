import { Component, Input, OnDestroy } from '@angular/core';

import { FsPrompt } from '@firestitch/prompt';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsGalleryService } from '../../services/gallery.service';
import { Group } from '../../models/group';


@Component({
  selector: 'fs-gallery-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss' ]
})
export class FsGalleryGroupComponent implements OnDestroy {

  @Input() public group: Group = null;

  private _destroy$ = new Subject<void>();

  constructor(
    public  galleryService: FsGalleryService,
    private _fsPrompt: FsPrompt,
  ) { }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public addGroup() {
    this._fsPrompt
      .input({
        label: 'Enter group name',
        title: 'New group',
        commitLabel: 'Save',
        required: true,
      })
      .subscribe((value: string | false) => {
        if (value) {
          const result$ = this.galleryService.groupConfig.addGroup(value);

          const sub = result$
            .pipe(
              takeUntil(
                this._destroy$,
              ),
            )
            .subscribe((data) => {
              const key = this.galleryService.groupConfig.groupTrackBy(data);
              const groupName = this.galleryService.groupConfig.nameValue(data);

              const group = new Group(groupName, key, false, data);

              this.galleryService.groupsStore.insertAfter(this.group, group);
              this.galleryService.updateDataGroups();

              sub.unsubscribe();
            });
        }
      });
  }

  public renameGroup() {
    this._fsPrompt.input({
      label: 'Enter group name',
      title: 'Change group name',
      commitLabel: 'Save',
      required: true,
      default: this.group.name,
    }).pipe(
      takeUntil(this._destroy$),
    ).subscribe((value: string | false) => {
      if (value) {
        const result$ = this.galleryService.groupConfig.groupChanged(this.group.data, this.group.items);

        const sub = result$
          .pipe(
            takeUntil(
              this._destroy$,
            ),
          )
          .subscribe(() => {
            this.group.name = value;
            this.galleryService.updateDataGroups();

            sub.unsubscribe();
          });
      }
    })
  }

  public deleteGroup() {
    const result$ = this.galleryService.groupConfig.groupDeleted(
      this.group.data,
      [...this.group.items]
    );

    const sub = result$
      .pipe(
        takeUntil(
          this._destroy$,
        ),
      )
      .subscribe(() => {
        this.galleryService.deleteGroup(this.group);

        sub.unsubscribe();
      })
  }
}
