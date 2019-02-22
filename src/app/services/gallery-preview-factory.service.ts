import { ComponentFactoryResolver, Injectable, Inject } from '@angular/core';

import { FsGalleryPreviewComponent } from '../components/gallery-preview/gallery-preview.component';
import { FsGalleryDataItem } from '../interfaces/gallery-data-item';
import { FsGalleryPreviewService } from '../services/gallery-preview.service';


@Injectable()
export class FsGalleryPreviewFactory {

  private factoryResolver = null;
  private rootViewContainer = null;

  constructor(
  @Inject(ComponentFactoryResolver) factoryResolver,
  private fsGalleryPreviewService: FsGalleryPreviewService) {
    this.factoryResolver = factoryResolver;
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  addDynamicComponent(data: FsGalleryDataItem) {
    const factory = this.factoryResolver
                        .resolveComponentFactory(FsGalleryPreviewComponent);

    const component = factory
      .create(this.rootViewContainer.parentInjector);

    this.rootViewContainer.insert(component.hostView);

    this.fsGalleryPreviewService.instance = component;
    this.fsGalleryPreviewService.setData(data);

    return component;
  }

}
