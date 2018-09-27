import { ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector } from '@angular/core';
import { FsGalleryPreviewComponent } from './../components';
import { FsGalleryDataItem } from '../interfaces';


@Injectable()
export class FsGalleryPreviewFactory {

  private factoryResolver = null;
  private rootViewContainer = null;

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
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

    component.instance.data = data;

    return component;
  }

}
