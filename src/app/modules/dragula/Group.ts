import { DragulaOptions } from './DragulaOptions';
import { DrakeWithModels } from './DrakeWithModels';

export class Group {
  public initEvents = false;
  constructor(
    public name: string,
    public drake: DrakeWithModels,
    public options: DragulaOptions,
  ) {}
}
