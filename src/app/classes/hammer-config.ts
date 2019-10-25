import { GestureConfig } from '@angular/material/core';


export class HammerConfig extends GestureConfig  {
  overrides = <any>{
      swipe: { velocity: 0.4, threshold: 20 }
  }
}
