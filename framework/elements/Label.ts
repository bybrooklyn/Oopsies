import { UIElement } from '../UIElement';

export class Label extends UIElement {
  constructor(content: string) {
    super('label', content);
  }

  for(id: string): this {
    return this.attr('for', id);
  }
}
