import { describe, expect, it } from 'vitest';
import { transformComponentSyntax } from '../framework/plugin/component-transform';

describe('transformComponentSyntax', () => {
  it('rewrites component declarations to runtime component calls', () => {
    const source = `
component Hero(props: HeroProps) {
  return stack({
    children: [text(props.title)],
  });
}
`;

    const result = transformComponentSyntax(source);

    expect(result.changed).toBe(true);
    expect(result.code).toContain("import { component as __oopsies_component } from 'oopsies';");
    expect(result.code).toContain('const Hero = __oopsies_component<HeroProps>("Hero", (props: HeroProps, ctx) => {');
    expect(result.code).toContain('return stack({');
  });

  it('supports exported component declarations and implicit helper rewriting', () => {
    const source = `
export component Counter(props: CounterProps) {
  const count = state(0);
  effect(() => {
    console.log(count());
  });

  return surface({
    body: text(props.label),
  });
}
`;

    const result = transformComponentSyntax(source);

    expect(result.changed).toBe(true);
    expect(result.code).toContain('export const Counter = __oopsies_component<CounterProps>("Counter", (props: CounterProps, ctx) => {');
    expect(result.code).toContain('const count = ctx.state(0);');
    expect(result.code).toContain('ctx.effect(() => {');
  });

  it('leaves regular files alone', () => {
    const source = `const title = 'hello';`;
    const result = transformComponentSyntax(source);

    expect(result.changed).toBe(false);
    expect(result.code).toBe(source);
  });
});
