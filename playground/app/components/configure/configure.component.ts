import { Component, Inject } from '@angular/core';
import { DrawerRef, DRAWER_DATA, DrawerDataProxy, FsDrawerModule } from '@firestitch/drawer';
import { ItemType } from '@firestitch/filter';
import { FsLabelModule } from '@firestitch/label';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';


@Component({
    templateUrl: './configure.component.html',
    styleUrls: ['./configure.component.scss'],
    standalone: true,
    imports: [FsDrawerModule, FsLabelModule, MatCheckbox, FormsModule, MatFormField, MatInput, MatSelect, MatOption]
})
export class ConfigureComponent {
  public config;
  public defaultConfig;
  public galleryService;

  constructor(public drawer: DrawerRef<ConfigureComponent>,
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
