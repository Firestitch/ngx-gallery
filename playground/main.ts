import { enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FsApiModule } from '@firestitch/api';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { ButtonStyle, FsFilterModule } from '@firestitch/filter';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsMenuModule } from '@firestitch/menu';
import { FsMessageModule } from '@firestitch/message';
import { FsScrollModule } from '@firestitch/scroll';
import { FsScrollbarModule } from '@firestitch/scrollbar';
import { FsSelectionModule } from '@firestitch/selection';

import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { ExamplesComponent } from './app/components';
import { environment } from './environments/environment';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, FormsModule, FsGalleryModule.forRoot(), FsFileModule.forRoot(), FsFilterModule.forRoot({
      button: {
        style: ButtonStyle.Flat,
        label: '',
      },
    }), FsApiModule.forRoot(), FsMenuModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), FsScrollModule.forRoot(), FsScrollbarModule.forRoot(), FsSelectionModule, FsLabelModule, FsListModule.forRoot({
      chips: true,
    })),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
    provideAnimations(),
    provideRouter(routes),
  ],
})
  .catch((err) => console.error(err));

