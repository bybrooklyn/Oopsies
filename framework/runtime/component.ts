import { UIElement } from '../UIElement';
import { effect, type Cleanup, computed, signal, type ReadableSignal, type WritableSignal } from './signals';

export type Child = UIElement | null | undefined | false;

type ComputedHookEntry = {
  fn: () => unknown;
  kind: 'computed';
  signal: ReadableSignal<unknown>;
};

type EffectHookEntry = {
  dispose: Cleanup;
  fn: () => void;
  kind: 'effect';
};

type HookEntry =
  | WritableSignal<unknown>
  | EffectHookEntry
  | ComputedHookEntry;

type ComponentInstance = {
  hooks: HookEntry[];
};

type RenderRoot = {
  instances: Map<string, ComponentInstance>;
  seenPaths: Set<string>;
};

type RenderFrame = {
  hookIndex: number;
  instance: ComponentInstance;
  path: string;
  root: RenderRoot;
};

const frameStack: RenderFrame[] = [];
let currentRoot: RenderRoot | null = null;

function currentFrame(): RenderFrame | null {
  return frameStack[frameStack.length - 1] ?? null;
}

function getMountTarget(target?: HTMLElement | string): HTMLElement {
  if (typeof target === 'string') {
    const resolved = document.querySelector<HTMLElement>(target);

    if (!resolved) {
      throw new Error(`OOPSIES could not find render target "${target}".`);
    }

    return resolved;
  }

  if (target) {
    return target;
  }

  const root = document.getElementById('root');

  if (!root) {
    throw new Error('OOPSIES could not find a render target. Expected #root to exist.');
  }

  return root;
}

function disposeHook(entry: HookEntry): void {
  if ('dispose' in entry) {
    entry.dispose();
  }
}

function disposeInstance(instance: ComponentInstance): void {
  for (const hook of instance.hooks) {
    disposeHook(hook);
  }

  instance.hooks.length = 0;
}

function useHook<T>(factory: () => T): T {
  const frame = currentFrame();

  if (!frame) {
    return factory();
  }

  const existing = frame.instance.hooks[frame.hookIndex] as T | undefined;

  if (existing !== undefined) {
    frame.hookIndex += 1;
    return existing;
  }

  const created = factory();
  frame.instance.hooks[frame.hookIndex] = created as HookEntry;
  frame.hookIndex += 1;

  return created;
}

export type ComponentContext = {
  computed<T>(fn: () => T): ReadableSignal<T>;
  effect(fn: () => void): void;
  signal<T>(initial: T): WritableSignal<T>;
  slot(value: Child, fallback?: Child): Child;
  state<T>(initial: T): WritableSignal<T>;
};

type ComponentRender<Props> = (props: Props, context: ComponentContext) => UIElement;

export type Component<Props> = ((props: Props) => UIElement) & {
  displayName: string;
};

function createContext(): ComponentContext {
  return {
    computed<T>(fn: () => T): ReadableSignal<T> {
      const entry = useHook<ComputedHookEntry>(() => {
        const holder: ComputedHookEntry = {
          fn: fn as () => unknown,
          kind: 'computed',
          signal: signal(undefined as unknown),
        };

        holder.signal = computed(() => holder.fn());

        return holder;
      });

      if (entry.kind === 'computed') {
        entry.fn = fn as () => unknown;
        return entry.signal as ReadableSignal<T>;
      }

      return computed(fn);
    },

    effect(fn: () => void): void {
      const entry = useHook<EffectHookEntry>(() => {
        const holder: EffectHookEntry = {
          dispose: () => undefined,
          fn,
          kind: 'effect',
        };

        holder.dispose = effect(() => {
          holder.fn();
        });

        return holder;
      });

      if (entry.kind === 'effect') {
        entry.fn = fn;
      }
    },

    signal<T>(initial: T): WritableSignal<T> {
      const entry = useHook(() => signal(initial));
      return entry as WritableSignal<T>;
    },

    slot(value: Child, fallback?: Child): Child {
      if (value === undefined || value === null || value === false) {
        return fallback ?? null;
      }

      return value;
    },

    state<T>(initial: T): WritableSignal<T> {
      return this.signal(initial);
    },
  };
}

function useContext(): ComponentContext {
  return createContext();
}

export function useState<T>(initial: T): WritableSignal<T> {
  return useContext().state(initial);
}

export function useSignal<T>(initial: T): WritableSignal<T> {
  return useContext().signal(initial);
}

export function useComputed<T>(fn: () => T): ReadableSignal<T> {
  return useContext().computed(fn);
}

export function useEffect(fn: () => void): void {
  useContext().effect(fn);
}

export function useSlot(value: Child, fallback?: Child): Child {
  return useContext().slot(value, fallback);
}

export function component<Props>(render: ComponentRender<Props>): Component<Props>;
export function component<Props>(name: string, render: ComponentRender<Props>): Component<Props>;
export function component<Props>(
  nameOrRender: string | ComponentRender<Props>,
  maybeRender?: ComponentRender<Props>,
): Component<Props> {
  const render = typeof nameOrRender === 'string' ? maybeRender : nameOrRender;
  const name =
    typeof nameOrRender === 'string'
      ? nameOrRender
      : nameOrRender.name && nameOrRender.name !== 'anonymous'
        ? nameOrRender.name
        : 'Component';

  if (!render) {
    throw new Error('OOPSIES component() requires a render function.');
  }

  const wrapped = ((props: Props) => {
    const parent = currentFrame();

    if (!currentRoot || !parent) {
      return render(props, createContext());
    }

    const path = `${parent.path}.${parent.hookIndex}`;
    parent.hookIndex += 1;

    currentRoot.seenPaths.add(path);

    const instance = currentRoot.instances.get(path) ?? { hooks: [] };
    currentRoot.instances.set(path, instance);

    const frame: RenderFrame = {
      hookIndex: 0,
      instance,
      path,
      root: currentRoot,
    };

    frameStack.push(frame);

    try {
      return render(props, createContext());
    } finally {
      frameStack.pop();
    }
  }) as Component<Props>;

  wrapped.displayName = name;

  return wrapped;
}

export function renderApp(factory: () => UIElement, target?: HTMLElement | string): Cleanup {
  const mountTarget = getMountTarget(target);
  const root: RenderRoot = {
    instances: new Map(),
    seenPaths: new Set(),
  };

  const stop = effect(() => {
    root.seenPaths = new Set();
    currentRoot = root;
    frameStack.push({
      hookIndex: 0,
      instance: { hooks: [] },
      path: 'root',
      root,
    });

    try {
      mountTarget.replaceChildren();
      factory().render(mountTarget);
    } finally {
      frameStack.pop();
      currentRoot = null;
    }

    for (const [path, instance] of [...root.instances.entries()]) {
      if (!root.seenPaths.has(path)) {
        disposeInstance(instance);
        root.instances.delete(path);
      }
    }
  });

  return () => {
    stop();

    for (const instance of root.instances.values()) {
      disposeInstance(instance);
    }

    root.instances.clear();
  };
}

export function render(tree: UIElement | (() => UIElement), target?: HTMLElement | string): Cleanup {
  return renderApp(typeof tree === 'function' ? tree : () => tree, target);
}
