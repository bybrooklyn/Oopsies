import { UIElement } from '../UIElement';

export class Select extends UIElement {
  constructor() {
    super('select');
  }

  private get selectEl(): HTMLSelectElement {
    return this.el as HTMLSelectElement;
  }

  disabled(value = true): this {
    this.selectEl.disabled = value;
    return this;
  }

  getValue(): string {
    return this.selectEl.value;
  }

  multiple(value = true): this {
    this.selectEl.multiple = value;
    return this;
  }

  name(value: string): this {
    this.selectEl.name = value;
    return this;
  }

  required(value = true): this {
    this.selectEl.required = value;
    return this;
  }

  value(value: string): this {
    this.selectEl.value = value;
    return this;
  }
}
