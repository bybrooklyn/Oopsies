import { Box } from './Box';
import type { Child } from '../runtime/component';
import { addChildren, applyCommonOptions, child, type CommonBuilderOptions } from '../runtime/element-helpers';

export type SurfaceProps = CommonBuilderOptions & {
  body?: Child;
  children?: Child[];
  footer?: Child;
  gap?: string;
  header?: Child;
  pad?: string;
};

function slotBox(className: string, value: Child): Box | null {
  const normalized = child(value);

  if (!normalized) {
    return null;
  }

  return new Box().class(className).add(normalized);
}

export class Surface extends Box {
  constructor(props: SurfaceProps = {}) {
    super();
    this.class('oops-surface')
      .flex('column', props.gap ?? '1rem')
      .padding(props.pad ?? '1.25rem')
      .style('background', 'var(--surface-background, rgba(255, 255, 255, 0.92))')
      .style('border', '1px solid var(--surface-border, rgba(15, 23, 42, 0.08))')
      .style('border-radius', 'var(--surface-radius, 1.25rem)')
      .style('box-shadow', 'var(--surface-shadow, 0 12px 30px rgba(15, 23, 42, 0.06))');

    applyCommonOptions(this, props);

    const slots = [
      slotBox('oops-surface-header', props.header ?? null),
      slotBox('oops-surface-body', props.body ?? null),
      ...((props.children ?? []).map((value) => child(value))),
      slotBox('oops-surface-footer', props.footer ?? null),
    ].filter(Boolean) as Box[];

    addChildren(this, slots);
  }
}
