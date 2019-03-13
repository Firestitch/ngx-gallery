import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { FsGalleryModule } from '@firestitch/gallery';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsFileModule } from '@firestitch/file';
import { FsMenuModule } from '@firestitch/menu';

import { DragulaModule } from 'ng2-dragula';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './material.module';
import {
  ExampleComponent,
  SimplePreviewComponent,
  ExamplesComponent
} from './components';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    DragulaModule.forRoot(),
    FsGalleryModule.forRoot(),
    FsFileModule.forRoot(),
    FsMenuModule,
    RouterModule.forRoot(routes),
    FsExampleModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    FsMessageModule.forRoot(),
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    SimplePreviewComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {
}
