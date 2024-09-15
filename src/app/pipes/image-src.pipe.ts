import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { FsApiFile } from '@firestitch/api';
import { FsFile } from '@firestitch/file';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Pipe({
  name: 'imageSrc',
})
export class ImageSrcPipe implements PipeTransform {

  constructor(    
    private _sanitizer: DomSanitizer,
  ) {}

  public transform(
    url: string | FsApiFile | FsFile | File, 
    cssUrl: boolean = false,
  ): Observable<string | SafeUrl> {
    if(!url){
      return of(null);
    }

    if(url instanceof File) {
      url = new FsFile(url);
    }

    if(cssUrl) {
      if (url instanceof FsApiFile) {
        return url.base64Url
          .pipe(
            map((data) => (`url(${data})`)),
          );

      } else if(url instanceof FsFile) {
        return url.base64Url
          .pipe(
            map((data) => `url(${data})`),
          );
      }
 
      return of(`url(${url})`);
      

    } 
    if(url instanceof FsApiFile) {
      return url.safeBase64Url;
    }

    if(url instanceof FsFile) {
      return url.base64Url
        .pipe(
          map((data) => this._sanitizer.bypassSecurityTrustResourceUrl(data)),
        );
    }

    return of(url);
    
  }
}
