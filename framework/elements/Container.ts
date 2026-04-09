import { Box } from './Box';
import type { Child } from '../runtime/component';
import { addChildren, applyCommonOptions, type CommonBuilderOptions } from '../runtime/element-helpers';

export type ContainerProps = CommonBuilderOptions & {
  children?: Child[];
  max?: string;
  pad?: string;
};

export class Container extends Box {
  constructor(props: ContainerProps = {}) {
    super();
    this.width('min(100%, 100%)');
    this.maxWidth(props.max ?? '72rem');
    this.margin('0 auto');
    this.padding(`0 ${props.pad ?? '1rem'}`);
    applyCommonOptions(this, props);
    addChildren(this, props.children);
  }
}
