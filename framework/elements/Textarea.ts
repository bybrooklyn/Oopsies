import { UIElement } from '../UIElement';

export class Textarea extends UIElement {
  constructor() {
    super('textarea');
  }

  private get textareaEl(): HTMLTextAreaElement {
    return this.el as HTMLTextAreaElement;
  }

  cols(value: number): this {
    this.textareaEl.cols = value;
    return this;
  }

  disabled(value = true): this {
    this.textareaEl.disabled = value;
    return this;
  }

  getValue(): string {
    return this.textareaEl.value;
  }

  name(value: string): this {
    this.textareaEl.name = value;
    return this;
  }

  placeholder(value: string): this {
    this.textareaEl.placeholder = value;
    return this;
  }

  required(value = true): this {
    this.textareaEl.required = value;
    return this;
  }

  rows(value: number): this {
    this.textareaEl.rows = value;
    return this;
  }

  value(value: string): this {
    this.textareaEl.value = value;
    return this;
  }
}
