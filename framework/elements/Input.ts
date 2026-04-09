import { UIElement } from '../UIElement';

export class Input extends UIElement {
  constructor(type: string) {
    super('input');
    this.attr('type', type);
  }

  private get inputEl(): HTMLInputElement {
    return this.el as HTMLInputElement;
  }

  placeholder(value: string): this {
    this.inputEl.placeholder = value;
    return this;
  }

  value(value: string): this {
    this.inputEl.value = value;
    return this;
  }

  getValue(): string {
    return this.inputEl.value;
  }

  checked(value = true): this {
    this.inputEl.checked = value;
    return this;
  }

  isChecked(): boolean {
    return this.inputEl.checked;
  }

  name(value: string): this {
    this.inputEl.name = value;
    return this;
  }

  required(value = true): this {
    this.inputEl.required = value;
    return this;
  }

  disabled(value = true): this {
    this.inputEl.disabled = value;
    return this;
  }
}
