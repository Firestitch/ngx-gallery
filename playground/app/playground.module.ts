import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { FsDrawerModule } from '@firestitch/drawer';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsLabelModule } from '@firestitch/label';
import { FsMenuModule } from '@firestitch/menu';
import { FsMessageModule } from '@firestitch/message';
import { FsScrollbarModule } from '@firestitch/scrollbar';

import { DragulaModule } from 'ng2-dragula';
import { ToastrModule } from 'ngx-toastr';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FsApiModule } from '@firestitch/api';
import { ButtonStyle, FsFilterModule } from '@firestitch/filter';
import { FsListModule } from '@firestitch/list';
import { FsScrollModule } from '@firestitch/scroll';
import { FsSelectionModule } from '@firestitch/selection';
import { AppComponent } from './app.component';
import {
  ConfigureComponent,
  CoverComponent,
  ExampleComponent,
  ExamplesComponent,
  PreviewComponent,
  SimplePreviewComponent
} from './components';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        FormsModule,
        DragulaModule.forRoot(),
        FsGalleryModule.forRoot(),
        FsFileModule.forRoot(),
        FsFilterModule.forRoot({
            button: {
                style: ButtonStyle.Flat,
                label: '',
            }
        }),
        FsApiModule.forRoot(),
        FsMenuModule,
        RouterModule.forRoot(routes, {}),
        FsExampleModule.forRoot(),
        ToastrModule.forRoot({ preventDuplicates: true }),
        FsMessageModule.forRoot(),
        FsScrollModule.forRoot(),
        FsScrollbarModule.forRoot(),
        FsSelectionModule,
        FsDrawerModule,
        FsLabelModule,
        FsListModule.forRoot({
            chips: true,
        }),
    ],
    declarations: [
        AppComponent,
        ExamplesComponent,
        ExampleComponent,
        SimplePreviewComponent,
        ConfigureComponent,
        CoverComponent,
        PreviewComponent,
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } }
    ]
})
export class PlaygroundModule {
}
