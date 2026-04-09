export abstract class UIElement {
  protected el: HTMLElement;

  constructor(tag: string, content?: string) {
    this.el = document.createElement(tag);

    if (content !== undefined) {
      this.el.textContent = content;
    }
  }

  add(...children: UIElement[]): this {
    for (const child of children) {
      this.el.appendChild(child.el);
    }

    return this;
  }

  text(content: string): this {
    this.el.textContent = content;
    return this;
  }

  class(name: string): this {
    const classes = name.split(/\s+/).filter(Boolean);
    this.el.classList.add(...classes);
    return this;
  }

  classes(...names: string[]): this {
    for (const name of names) {
      this.class(name);
    }

    return this;
  }

  removeClass(name: string): this {
    const classes = name.split(/\s+/).filter(Boolean);
    this.el.classList.remove(...classes);
    return this;
  }

  style(property: string, value: string): this {
    this.el.style.setProperty(property, value);
    return this;
  }

  styles(properties: Record<string, string>): this {
    for (const [property, value] of Object.entries(properties)) {
      this.style(property, value);
    }

    return this;
  }

  onClick(fn: (e: MouseEvent) => void): this {
    this.el.addEventListener('click', fn);
    return this;
  }

  onInput(fn: (e: Event) => void): this {
    this.el.addEventListener('input', fn);
    return this;
  }

  onChange(fn: (e: Event) => void): this {
    this.el.addEventListener('change', fn);
    return this;
  }

  onHover(enter: () => void, leave?: () => void): this {
    this.el.addEventListener('mouseenter', enter);

    if (leave) {
      this.el.addEventListener('mouseleave', leave);
    }

    return this;
  }

  onKeyDown(fn: (e: KeyboardEvent) => void): this {
    this.el.addEventListener('keydown', fn);
    return this;
  }

  attr(key: string, value: string): this {
    this.el.setAttribute(key, value);
    return this;
  }

  data(key: string, value: string): this {
    return this.attr(`data-${key}`, value);
  }

  role(value: string): this {
    return this.attr('role', value);
  }

  id(name: string): this {
    this.el.id = name;
    return this;
  }

  width(value: string): this {
    return this.style('width', value);
  }

  minWidth(value: string): this {
    return this.style('min-width', value);
  }

  maxWidth(value: string): this {
    return this.style('max-width', value);
  }

  height(value: string): this {
    return this.style('height', value);
  }

  minHeight(value: string): this {
    return this.style('min-height', value);
  }

  maxHeight(value: string): this {
    return this.style('max-height', value);
  }

  padding(value: string): this {
    return this.style('padding', value);
  }

  margin(value: string): this {
    return this.style('margin', value);
  }

  gap(value: string): this {
    return this.style('gap', value);
  }

  align(value: string): this {
    return this.style('align-items', value);
  }

  justify(value: string): this {
    return this.style('justify-content', value);
  }

  wrap(value = 'wrap'): this {
    return this.style('flex-wrap', value);
  }

  flex(direction: 'row' | 'column' = 'column', gap?: string): this {
    this.styles({
      display: 'flex',
      'flex-direction': direction,
    });

    if (gap) {
      this.gap(gap);
    }

    return this;
  }

  grid(columns: string, gap?: string): this {
    this.styles({
      display: 'grid',
      'grid-template-columns': columns,
    });

    if (gap) {
      this.gap(gap);
    }

    return this;
  }

  protected resolveTarget(target?: HTMLElement | string): HTMLElement | null {
    if (typeof target === 'string') {
      return document.querySelector<HTMLElement>(target);
    }

    return target ?? document.getElementById('root');
  }

  render(target?: HTMLElement | string): void {
    const mountTarget = this.resolveTarget(target);

    if (!mountTarget) {
      throw new Error('OOPSIES could not find a render target. Expected #root to exist.');
    }

    mountTarget.appendChild(this.el);
  }
}
