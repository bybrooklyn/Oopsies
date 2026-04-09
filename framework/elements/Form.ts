import { UIElement } from '../UIElement';

export class Form extends UIElement {
  constructor(action = '', method: 'get' | 'post' = 'post') {
    super('form');

    if (action) {
      this.action(action);
    }

    this.method(method);
  }

  action(value: string): this {
    return this.attr('action', value);
  }

  enctype(value: string): this {
    return this.attr('enctype', value);
  }

  method(value: 'get' | 'post'): this {
    return this.attr('method', value);
  }

  noValidate(value = true): this {
    if (value) {
      this.attr('novalidate', 'novalidate');
      return this;
    }

    (this.el as HTMLFormElement).removeAttribute('novalidate');
    return this;
  }

  target(value: string): this {
    return this.attr('target', value);
  }
}
