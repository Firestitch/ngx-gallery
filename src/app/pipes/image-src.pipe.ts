import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { FsApiFile } from '@firestitch/api';
import { Observable, of } from 'rxjs';


@Pipe({
  name: 'imageSrc'
})
export class ImageSrcPipe implements PipeTransform {
  public transform(url: string | FsApiFile): Observable<string | SafeUrl> {
    return url instanceof FsApiFile ?
      url.safeBase64Url :
      of(url);
  }
}