import { UIElement } from '../UIElement';

export class Page extends UIElement {
  private mountedTarget: HTMLElement | null = null;

  constructor() {
    super('div');
  }

  build(): UIElement {
    return this;
  }

  override render(target?: HTMLElement | string): void {
    const mountTarget = this.resolveTarget(target);

    if (!mountTarget) {
      throw new Error('OOPSIES could not find a render target. Expected #root to exist.');
    }

    this.mountedTarget = mountTarget;
    mountTarget.replaceChildren();

    const tree = this.build();

    if (tree === this) {
      super.render(mountTarget);
      return;
    }

    tree.render(mountTarget);
  }

  reRender(): void {
    this.render(this.mountedTarget ?? undefined);
  }
}
