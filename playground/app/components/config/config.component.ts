import { Component, Inject } from '@angular/core';
import { DrawerRef, DRAWER_DATA, DrawerDataProxy } from '@firestitch/drawer';


@Component({
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {
  public config;
  public defaultConfig;
  public galleryService;

  constructor(public drawer: DrawerRef<ConfigComponent>,
              @Inject(DRAWER_DATA) public data: DrawerDataProxy<any>) {
    this.config = data.config;
    this.defaultConfig = data.defaultConfig;
    this.galleryService = data.galleryService;
  }

  infoChange(event) {
    if (event) {
      this.config.info = this.defaultConfig.info;
    } else {
      this.config.info = false;
    }
  }

  imageChange() {
    this.galleryService.updateImageDims();
  }
}
