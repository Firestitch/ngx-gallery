import { GestureConfig } from '@angular/material';


export class HammerConfig extends GestureConfig  {
  overrides = <any>{
      swipe: { velocity: 0.4, threshold: 20 }
  }
}
