export type Cleanup = () => void;

type Dependency = {
  subscribers: Set<Computation>;
};

class Computation {
  deps = new Set<Dependency>();
  disposed = false;

  constructor(private readonly fn: () => void) {}

  run(): void {
    if (this.disposed) {
      return;
    }

    for (const dep of this.deps) {
      dep.subscribers.delete(this);
    }

    this.deps.clear();

    const previous = activeComputation;
    activeComputation = this;

    try {
      this.fn();
    } finally {
      activeComputation = previous;
    }
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    for (const dep of this.deps) {
      dep.subscribers.delete(this);
    }

    this.deps.clear();
  }
}

let activeComputation: Computation | null = null;

function track(dep: Dependency): void {
  if (!activeComputation) {
    return;
  }

  dep.subscribers.add(activeComputation);
  activeComputation.deps.add(dep);
}

type ManualSubscriber<T> = (value: T) => void;

export type ReadableSignal<T> = (() => T) & {
  get(): T;
  subscribe(listener: ManualSubscriber<T>): Cleanup;
};

export type WritableSignal<T> = ReadableSignal<T> & {
  set(value: T): T;
  update(updater: (value: T) => T): T;
};

function createReadable<T>(
  dep: Dependency,
  read: () => T,
  subscribe: (listener: ManualSubscriber<T>) => Cleanup,
): ReadableSignal<T> {
  const accessor = (() => {
    track(dep);
    return read();
  }) as ReadableSignal<T>;

  accessor.get = () => accessor();
  accessor.subscribe = subscribe;

  return accessor;
}

export function signal<T>(initial: T): WritableSignal<T> {
  let value = initial;
  const dep: Dependency = { subscribers: new Set() };
  const listeners = new Set<ManualSubscriber<T>>();

  const subscribe = (listener: ManualSubscriber<T>) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const accessor = createReadable(dep, () => value, subscribe) as WritableSignal<T>;

  accessor.set = (nextValue: T) => {
    if (Object.is(value, nextValue)) {
      return value;
    }

    value = nextValue;

    for (const computation of [...dep.subscribers]) {
      computation.run();
    }

    for (const listener of listeners) {
      listener(value);
    }

    return value;
  };

  accessor.update = (updater: (current: T) => T) => accessor.set(updater(value));

  return accessor;
}

export function effect(fn: () => void): Cleanup {
  const computation = new Computation(fn);
  computation.run();

  return () => {
    computation.dispose();
  };
}

export function computed<T>(fn: () => T): ReadableSignal<T> {
  const state = signal(fn());
  const stop = effect(() => {
    state.set(fn());
  });

  const accessor = (() => state()) as ReadableSignal<T>;
  accessor.get = () => accessor();
  accessor.subscribe = (listener) => {
    const unsubscribe = state.subscribe(listener);

    return () => {
      unsubscribe();
    };
  };

  Object.defineProperty(accessor, 'dispose', {
    value: stop,
    enumerable: false,
  });

  return accessor;
}

export function untrack<T>(fn: () => T): T {
  const previous = activeComputation;
  activeComputation = null;

  try {
    return fn();
  } finally {
    activeComputation = previous;
  }
}
