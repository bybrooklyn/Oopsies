import { Box } from './Box';
import type { Child } from '../runtime/component';
import { addChildren, applyCommonOptions, type CommonBuilderOptions } from '../runtime/element-helpers';

export type RowProps = CommonBuilderOptions & {
  align?: string;
  children?: Child[];
  gap?: string;
  justify?: string;
  wrap?: string | boolean;
};

export class Row extends Box {
  constructor(props: RowProps = {}) {
    super();
    this.flex('row', props.gap ?? '1rem');
    this.wrap(props.wrap === false ? 'nowrap' : typeof props.wrap === 'string' ? props.wrap : 'wrap');

    if (props.align) {
      this.align(props.align);
    }

    if (props.justify) {
      this.justify(props.justify);
    }

    applyCommonOptions(this, props);
    addChildren(this, props.children);
  }
}
