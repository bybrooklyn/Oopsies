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

export function box(props: CommonBuilderOptions & { children?: Child[] } = {}): Box {
  return addChildren(applyCommonOptions(new Box(), props), props.children) as Box;
}

export function button(content: string, props: CommonBuilderOptions = {}): Button {
  return applyCommonOptions(new Button(content), props);
}

export function container(props: ContainerProps = {}): Container {
  return new Container(props);
}

export function field(props: FieldProps): Field {
  return new Field(props);
}

export function form(
  props: CommonBuilderOptions & {
    action?: string;
    children?: Child[];
    method?: 'get' | 'post';
  } = {},
): Form {
  const element = new Form(props.action ?? '', props.method ?? 'post');
  applyCommonOptions(element, props);
  addChildren(element, props.children);
  return element;
}

export function grid(props: GridProps = {}): Grid {
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

export function page(props: CommonBuilderOptions & { children?: Child[] } = {}): Page {
  const element = new Page();
  applyCommonOptions(element, props);
  addChildren(element, props.children);
  return element;
}

export function row(props: RowProps = {}): Row {
  return new Row(props);
}

export function select(
  props: CommonBuilderOptions & {
    children?: Child[];
  } = {},
): Select {
  const element = new Select();
  applyCommonOptions(element, props);
  addChildren(element, props.children);
  return element;
}

export function stack(props: StackProps = {}): Stack {
  return new Stack(props);
}

export function submit(content: string, props: CommonBuilderOptions = {}): Submit {
  return applyCommonOptions(new Submit(content), props);
}

export function surface(props: SurfaceProps = {}): Surface {
  return new Surface(props);
}

export function text(content: string, props: CommonBuilderOptions = {}): Text {
  return applyCommonOptions(new Text(content), props);
}

export function textarea(props: CommonBuilderOptions = {}): Textarea {
  return applyCommonOptions(new Textarea(), props);
}
