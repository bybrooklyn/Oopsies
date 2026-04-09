import { UIElement } from '../UIElement';

export class Button extends UIElement {
  constructor(content: string) {
    super('button', content);
  }
}
