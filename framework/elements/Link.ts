import { UIElement } from '../UIElement';

export class Link extends UIElement {
  constructor(content: string, href: string) {
    super('a', content);
    this.attr('href', href);
  }
}
