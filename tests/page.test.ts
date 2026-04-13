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

describe('UIElement accessibility and event helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('tabIndex, ariaLabel, and hidden set the correct DOM properties', () => {
    const btn = button('Click me')
      .tabIndex(3)
      .ariaLabel('Close dialog')
      .hidden();

    render(btn, '#root');

    const el = document.querySelector<HTMLButtonElement>('#root button');
    expect(el?.tabIndex).toBe(3);
    expect(el?.getAttribute('aria-label')).toBe('Close dialog');
    expect(el?.hidden).toBe(true);
  });

  it('onFocus and onBlur fire on the correct events', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    const el = input('text').onFocus(onFocus).onBlur(onBlur);
    render(el, '#root');

    const rendered = document.querySelector<HTMLInputElement>('#root input');
    rendered?.dispatchEvent(new FocusEvent('focus'));
    rendered?.dispatchEvent(new FocusEvent('blur'));

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('onKeyUp fires on keyup events', () => {
    const onKeyUp = vi.fn();
    const el = input('text').onKeyUp(onKeyUp);
    render(el, '#root');

    const rendered = document.querySelector<HTMLInputElement>('#root input');
    rendered?.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

    expect(onKeyUp).toHaveBeenCalledTimes(1);
  });

  it('generic on() handler attaches any DOM event listener', () => {
    const handler = vi.fn();
    const el = button('Test').on('dblclick', handler);
    render(el, '#root');

    const rendered = document.querySelector<HTMLButtonElement>('#root button');
    rendered?.dispatchEvent(new MouseEvent('dblclick'));

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
