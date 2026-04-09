import { UIElement } from '../UIElement';

export class Heading extends UIElement {
  constructor(level: 1 | 2 | 3 | 4 | 5 | 6, content: string) {
    super(`h${level}`, content);
  }
}
