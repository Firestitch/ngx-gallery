import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


@Pipe({
    name: 'imageSrc',
    standalone: true,
})
export class ImageSrcPipe implements PipeTransform {
  private _sanitizer = inject(DomSanitizer);


  public transform(
    url: string | FsApiFile | FsFile | File, 
  ): Observable<string | SafeUrl> {
    if(!url){
      return of(null);
    }

    if(url instanceof File) {
      url = new FsFile(url);
    }

    return of(url)
      .pipe(
        switchMap((_url) => {
          return (_url instanceof FsApiFile) ? 
            _url.safeDataUrl : 
            of(_url);
        }),
        switchMap((_url) => {
          if(_url instanceof FsFile) {
            return _url.base64Url
              .pipe(
                map((data) => this._sanitizer.bypassSecurityTrustResourceUrl(data)),
              );
          }

          return of(_url);
        }),
        catchError(() => of('Image error')),
      );
  }
}
