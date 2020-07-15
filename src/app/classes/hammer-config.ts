import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';


@Injectable()
export class HammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      swipe: { velocity: 0.4, threshold: 20 }
  }
}
