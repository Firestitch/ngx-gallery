import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsGalleryModule } from '@firestitch/gallery';
import { FsFileModule } from '@firestitch/file';
import { FsFilterModule, ButtonStyle } from '@firestitch/filter';
import { FsApiModule } from '@firestitch/api';
import { FsMenuModule } from '@firestitch/menu';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsScrollModule } from '@firestitch/scroll';
import { FsScrollbarModule } from '@firestitch/scrollbar';
import { FsSelectionModule } from '@firestitch/selection';
import { FsDrawerModule } from '@firestitch/drawer';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { AppComponent } from './app/app.component';

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
        }), FsApiModule.forRoot(), FsMenuModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), FsScrollModule.forRoot(), FsScrollbarModule.forRoot(), FsSelectionModule, FsDrawerModule, FsLabelModule, FsListModule.forRoot({
            chips: true,
        })),
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

