import { UIElement } from '../UIElement';

export class Option extends UIElement {
  constructor(label: string, value: string) {
    super('option', label);
    this.value(value);
  }

  selected(value = true): this {
    (this.el as HTMLOptionElement).selected = value;
    return this;
  }

  value(value: string): this {
    return this.attr('value', value);
  }
}
