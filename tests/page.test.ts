// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { button, component, input, render, stack, text, useState } from '../framework';

describe('render and inputs', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div><div id="alt-root"></div>';
  });

  it('supports selector-based render targets and input helpers', () => {
    const onInput = vi.fn();
    const onChange = vi.fn();

    const field = input('email')
      .placeholder('Email')
      .name('email')
      .value('first@example.com')
      .required()
      .onInput(onInput)
      .onChange(onChange);

    render(() => stack(field), '#alt-root');

    const renderedInput = document.querySelector<HTMLInputElement>('#alt-root input');

    expect(renderedInput).not.toBeNull();
    expect(renderedInput?.placeholder).toBe('Email');
    expect(renderedInput?.name).toBe('email');
    expect(renderedInput?.required).toBe(true);
    expect(field.getValue()).toBe('first@example.com');

    renderedInput?.dispatchEvent(new Event('input', { bubbles: true }));
    renderedInput?.dispatchEvent(new Event('change', { bubbles: true }));

    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports variadic children and layout helper methods', () => {
    const box = stack(text('One'), text('Two'))
      .classes('alpha', 'beta')
      .flex('row', '12px')
      .align('center')
      .justify('space-between')
      .width('20rem')
      .minHeight('8rem');

    render(box, '#root');

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
    const Counter = component('Counter', () => {
      const count = useState(0);

      return stack(
        text(`Count: ${count()}`),
        button('Increment').onClick(() => {
          count.update((value) => value + 1);
        }),
      );
    });

    render(() => Counter({}));

    expect(document.querySelector('#root')?.textContent).toContain('Count: 0');

    document.querySelector<HTMLButtonElement>('#root button')?.click();

    expect(document.querySelector('#root')?.textContent).toContain('Count: 1');
  });
});
