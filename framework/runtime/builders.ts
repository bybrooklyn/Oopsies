import { Box } from '../elements/Box';
import { Button } from '../elements/Button';
import { Container, type ContainerProps } from '../elements/Container';
import { Field, type FieldProps } from '../elements/Field';
import { Form } from '../elements/Form';
import { Grid, type GridProps } from '../elements/Grid';
import { Heading } from '../elements/Heading';
import { Image } from '../elements/Image';
import { Input } from '../elements/Input';
import { Label } from '../elements/Label';
import { Link } from '../elements/Link';
import { Option } from '../elements/Option';
import { Page } from '../elements/Page';
import { Row, type RowProps } from '../elements/Row';
import { Select } from '../elements/Select';
import { Stack, type StackProps } from '../elements/Stack';
import { Submit } from '../elements/Submit';
import { Surface, type SurfaceProps } from '../elements/Surface';
import { Text } from '../elements/Text';
import { Textarea } from '../elements/Textarea';
import { UIElement } from '../UIElement';
import type { Child } from './component';
import { addChildren, applyCommonOptions, type CommonBuilderOptions } from './element-helpers';

type BoxLikeOptions = CommonBuilderOptions & { children?: Child[] };

function isChild(value: unknown): value is Child {
  return value instanceof UIElement || value === null || value === undefined || value === false;
}

function isOptions(value: unknown): value is BoxLikeOptions {
  if (!value || typeof value !== 'object' || value instanceof UIElement || Array.isArray(value)) {
    return false;
  }

  return true;
}

function normalizeChildrenArgs(args: unknown[]): BoxLikeOptions {
  if (args.length === 0) {
    return {};
  }

  if (isOptions(args[0])) {
    const [options, ...rest] = args;
    return {
      ...options,
      children: [...(options.children ?? []), ...(rest as Child[])],
    };
  }

  return { children: args as Child[] };
}

export function box(...args: unknown[]): Box {
  const props = normalizeChildrenArgs(args);
  return addChildren(applyCommonOptions(new Box(), props), props.children) as Box;
}

export function button(content: string, props: CommonBuilderOptions = {}): Button {
  return applyCommonOptions(new Button(content), props);
}

export function container(...args: unknown[]): Container {
  const props = normalizeChildrenArgs(args) as ContainerProps;
  return new Container(props);
}

export function field(labelText: string, inputElement: Child, help?: Child): Field;
export function field(props: FieldProps): Field;
export function field(
  labelOrProps: FieldProps | string,
  inputElement?: Child,
  help?: Child,
): Field {
  if (typeof labelOrProps === 'string') {
    return new Field({
      help,
      input: inputElement ?? null,
      label: labelOrProps,
    });
  }

  return new Field(labelOrProps);
}

export function form(
  ...args: Array<
    | (CommonBuilderOptions & {
        action?: string;
        children?: Child[];
        method?: 'get' | 'post';
      })
    | Child
  >
): Form {
  const props = normalizeChildrenArgs(args as unknown[]) as CommonBuilderOptions & {
    action?: string;
    children?: Child[];
    method?: 'get' | 'post';
  };
  const element = new Form(props.action ?? '', props.method ?? 'post');
  applyCommonOptions(element, props);
  addChildren(element, props.children);
  return element;
}

export function grid(...args: unknown[]): Grid {
  const props = normalizeChildrenArgs(args) as GridProps;
  return new Grid(props);
}

export function heading(level: 1 | 2 | 3 | 4 | 5 | 6, content: string, props: CommonBuilderOptions = {}): Heading {
  return applyCommonOptions(new Heading(level, content), props);
}

export function image(src: string, alt: string, props: CommonBuilderOptions = {}): Image {
  return applyCommonOptions(new Image(src, alt), props);
}

export function input(type: string, props: CommonBuilderOptions = {}): Input {
  return applyCommonOptions(new Input(type), props);
}

export function label(content: string, props: CommonBuilderOptions = {}): Label {
  return applyCommonOptions(new Label(content), props);
}

export function link(content: string, href: string, props: CommonBuilderOptions = {}): Link {
  return applyCommonOptions(new Link(content, href), props);
}

export function option(labelText: string, value: string, props: CommonBuilderOptions = {}): Option {
  return applyCommonOptions(new Option(labelText, value), props);
}

export function page(...args: unknown[]): Page {
  const props = normalizeChildrenArgs(args) as CommonBuilderOptions & { children?: Child[] };
  const element = new Page();
  applyCommonOptions(element, props);
  addChildren(element, props.children);
  return element;
}

export function row(...args: unknown[]): Row {
  const props = normalizeChildrenArgs(args) as RowProps;
  return new Row(props);
}

export function select(
  ...args: Array<
    | (CommonBuilderOptions & {
        children?: Child[];
      })
    | Child
  >
): Select {
  const props = normalizeChildrenArgs(args as unknown[]) as CommonBuilderOptions & {
    children?: Child[];
  };
  const element = new Select();
  applyCommonOptions(element, props);
  addChildren(element, props.children);
  return element;
}

export function stack(...args: unknown[]): Stack {
  const props = normalizeChildrenArgs(args) as StackProps;
  return new Stack(props);
}

export function submit(content: string, props: CommonBuilderOptions = {}): Submit {
  return applyCommonOptions(new Submit(content), props);
}

export function surface(...args: Array<SurfaceProps | Child>): Surface {
  if (args.length === 0) {
    return new Surface();
  }

  if (isOptions(args[0])) {
    return new Surface(args[0] as SurfaceProps);
  }

  return new Surface({ children: args as Child[] });
}

export function text(content: string, props: CommonBuilderOptions = {}): Text {
  return applyCommonOptions(new Text(content), props);
}

export function textarea(props: CommonBuilderOptions = {}): Textarea {
  return applyCommonOptions(new Textarea(), props);
}
