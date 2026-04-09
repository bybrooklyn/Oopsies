// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Box, Input, Page, Text, button, component, renderApp, signal, stack, text } from '../framework';

describe('Page and Input', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div><div id="alt-root"></div>';
  });

  it('re-renders from build() and replaces the previous tree', () => {
    class CounterPage extends Page {
      private count = 0;

      increment(): void {
        this.count += 1;
        this.reRender();
      }

      override build() {
        return new Box().add(new Text(`Count: ${this.count}`));
      }
    }

    const page = new CounterPage();
    page.render();

    expect(document.querySelector('#root')?.textContent).toBe('Count: 0');

    page.increment();

    expect(document.querySelector('#root')?.textContent).toBe('Count: 1');
    expect(document.querySelectorAll('#root p')).toHaveLength(1);
  });

  it('supports selector-based render targets and input helpers', () => {
    const onInput = vi.fn();
    const onChange = vi.fn();

    const field = new Input('email')
      .placeholder('Email')
      .name('email')
      .value('first@example.com')
      .required()
      .onInput(onInput)
      .onChange(onChange);

    new Box().add(field).render('#alt-root');

    const input = document.querySelector<HTMLInputElement>('#alt-root input');

    expect(input).not.toBeNull();
    expect(input?.placeholder).toBe('Email');
    expect(input?.name).toBe('email');
    expect(input?.required).toBe(true);
    expect(field.getValue()).toBe('first@example.com');

    input?.dispatchEvent(new Event('input', { bubbles: true }));
    input?.dispatchEvent(new Event('change', { bubbles: true }));

    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports variadic children and layout helper methods', () => {
    const box = new Box()
      .classes('alpha', 'beta')
      .flex('row', '12px')
      .align('center')
      .justify('space-between')
      .width('20rem')
      .minHeight('8rem')
      .add(new Text('One'), new Text('Two'));

    box.render('#root');

    const rendered = document.querySelector<HTMLElement>('#root > div');

    expect(rendered?.classList.contains('alpha')).toBe(true);
    expect(rendered?.classList.contains('beta')).toBe(true);
    expect(rendered?.style.display).toBe('flex');
    expect(rendered?.style.flexDirection).toBe('row');
    expect(rendered?.style.gap).toBe('12px');
    expect(rendered?.style.alignItems).toBe('center');
    expect(rendered?.style.justifyContent).toBe('space-between');
    expect(rendered?.style.width).toBe('20rem');
    expect(rendered?.style.minHeight).toBe('8rem');
    expect(rendered?.children).toHaveLength(2);
  });

  it('rerenders a mounted function component when local state changes', () => {
    const Counter = component('Counter', (_, ctx) => {
      const count = ctx.state(0);

      return stack({
        children: [
          text(`Count: ${count()}`),
          button('Increment').onClick(() => {
            count.update((value) => value + 1);
          }),
        ],
      });
    });

    renderApp(() => Counter({}));

    expect(document.querySelector('#root')?.textContent).toContain('Count: 0');

    document.querySelector<HTMLButtonElement>('#root button')?.click();

    expect(document.querySelector('#root')?.textContent).toContain('Count: 1');
  });
});
