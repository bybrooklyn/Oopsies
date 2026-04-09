import { UIElement } from '../UIElement';

export class Text extends UIElement {
  constructor(content: string) {
    super('p', content);
  }
}
