import { UIElement } from '../UIElement';

export class Image extends UIElement {
  constructor(src: string, alt: string) {
    super('img');
    this.attr('src', src);
    this.attr('alt', alt);
  }
}
