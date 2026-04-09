import { UIElement } from '../UIElement';
import type { Child } from './component';

export type CommonBuilderOptions = {
  attrs?: Record<string, string>;
  className?: string | string[];
  id?: string;
  styles?: Record<string, string>;
};

export function child(value: Child): UIElement | null {
  if (!value) {
    return null;
  }

  return value;
}

export function addChildren(element: UIElement, children?: Child[]): UIElement {
  for (const entry of children ?? []) {
    const normalized = child(entry);

    if (normalized) {
      element.add(normalized);
    }
  }

  return element;
}

export function applyCommonOptions<T extends UIElement>(element: T, options: CommonBuilderOptions = {}): T {
  const classNames = Array.isArray(options.className) ? options.className : options.className ? [options.className] : [];

  for (const className of classNames) {
    element.class(className);
  }

  if (options.id) {
    element.id(options.id);
  }

  for (const [key, value] of Object.entries(options.attrs ?? {})) {
    element.attr(key, value);
  }

  for (const [property, value] of Object.entries(options.styles ?? {})) {
    element.style(property, value);
  }

  return element;
}
