import { Box } from './Box';
import type { Child } from '../runtime/component';
import { addChildren, applyCommonOptions, type CommonBuilderOptions } from '../runtime/element-helpers';

export type GridProps = CommonBuilderOptions & {
  align?: string;
  children?: Child[];
  columns?: number | string;
  gap?: string;
  min?: string;
};

function toColumns(columns?: number | string, min?: string): string {
  if (typeof columns === 'number') {
    return `repeat(${columns}, minmax(0, 1fr))`;
  }

  if (typeof columns === 'string') {
    return columns;
  }

  if (min) {
    return `repeat(auto-fit, minmax(${min}, 1fr))`;
  }

  return 'repeat(2, minmax(0, 1fr))';
}

export class Grid extends Box {
  constructor(props: GridProps = {}) {
    super();
    this.grid(toColumns(props.columns, props.min), props.gap ?? '1rem');

    if (props.align) {
      this.align(props.align);
    }

    applyCommonOptions(this, props);
    addChildren(this, props.children);
  }
}
