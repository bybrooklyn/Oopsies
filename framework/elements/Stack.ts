import { Box } from './Box';
import type { Child } from '../runtime/component';
import { addChildren, applyCommonOptions, type CommonBuilderOptions } from '../runtime/element-helpers';

export type StackProps = CommonBuilderOptions & {
  align?: string;
  children?: Child[];
  gap?: string;
  justify?: string;
};

export class Stack extends Box {
  constructor(props: StackProps = {}) {
    super();
    this.flex('column', props.gap ?? '1rem');

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
