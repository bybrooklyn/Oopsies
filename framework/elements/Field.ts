import { Box } from './Box';
import type { Child } from '../runtime/component';
import { addChildren, applyCommonOptions, child, type CommonBuilderOptions } from '../runtime/element-helpers';
import { Label } from './Label';

export type FieldProps = CommonBuilderOptions & {
  error?: Child;
  help?: Child;
  input: Child;
  label?: Child | string;
};

function normalizeLabel(value: Child | string | undefined): Child {
  if (typeof value === 'string') {
    return new Label(value);
  }

  return value ?? null;
}

function normalizeTextSlot(className: string, value: Child): Box | null {
  const normalized = child(value);

  if (!normalized) {
    return null;
  }

  return new Box().class(className).add(normalized);
}

export class Field extends Box {
  constructor(props: FieldProps) {
    super();
    this.class('oops-field').flex('column', '0.5rem');
    applyCommonOptions(this, props);

    const label = child(normalizeLabel(props.label));
    const input = child(props.input);
    const help = normalizeTextSlot('oops-field-help', props.help ?? null);
    const error = normalizeTextSlot('oops-field-error', props.error ?? null);

    addChildren(this, [label, input, help, error].filter(Boolean) as Child[]);
  }
}
