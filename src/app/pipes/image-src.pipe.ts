import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Pipe({
  name: 'imageSrc'
})
export class ImageSrcPipe implements PipeTransform {

  public constructor(    
    private _sanitizer: DomSanitizer,
  ) {}

  public transform(url: string | FsApiFile | FsFile | File, cssUrl: boolean = false): Observable<string | SafeUrl> {
    if(url instanceof File) {
      url = new FsFile(url);
    }

    if(cssUrl) {
      if (url instanceof FsApiFile) {
        return url.base64
        .pipe(
          map((base64) => (`url(${base64})`)),
        );

      } else if(url instanceof FsFile) {
        return url.base64
        .pipe(
          map((base64) => `url(${base64})`),
        );
      } else {
        return of(`url(${url})`);
      }

    } else {
      if(url instanceof FsApiFile) {
        return url.safeBase64Url;
      }

      if(url instanceof FsFile) {
        return url.base64
          .pipe(
            map((base64) => this._sanitizer.bypassSecurityTrustResourceUrl(base64)),
          );
      }

      return of(url);
    }
  }
}