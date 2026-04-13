import { describe, expect, it, vi } from 'vitest';
import { batch, computed, effect, signal, untrack } from '../framework';

describe('signal', () => {
  it('reads and writes values', () => {
    const s = signal(1);
    expect(s()).toBe(1);
    s.set(2);
    expect(s.get()).toBe(2);
  });

  it('update applies a function to the current value', () => {
    const s = signal(3);
    s.update((v) => v * 2);
    expect(s()).toBe(6);
  });

  it('notifies manual subscribers on change', () => {
    const s = signal('a');
    const listener = vi.fn();
    const unsub = s.subscribe(listener);
    s.set('b');
    expect(listener).toHaveBeenCalledWith('b');
    unsub();
    s.set('c');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not notify subscribers when value is unchanged', () => {
    const s = signal(42);
    const listener = vi.fn();
    s.subscribe(listener);
    s.set(42);
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('computed', () => {
  it('derives a value from signals', () => {
    const a = signal(2);
    const b = signal(3);
    const sum = computed(() => a() + b());
    expect(sum()).toBe(5);
    a.set(10);
    expect(sum()).toBe(13);
  });

  it('does not call fn more than once on initialization', () => {
    const fn = vi.fn(() => 'value');
    const c = computed(fn);
    c(); // access
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('effect', () => {
  it('runs immediately and re-runs when deps change', () => {
    const s = signal(0);
    const log: number[] = [];
    const stop = effect(() => log.push(s()));
    expect(log).toEqual([0]);
    s.set(1);
    expect(log).toEqual([0, 1]);
    stop();
    s.set(2);
    expect(log).toEqual([0, 1]);
  });
});

describe('untrack', () => {
  it('reads a signal without tracking it as a dependency', () => {
    const a = signal(1);
    const b = signal(10);
    const log: number[] = [];
    effect(() => {
      const av = a();
      const bv = untrack(() => b());
      log.push(av + bv);
    });
    expect(log).toEqual([11]);
    b.set(20);
    expect(log).toEqual([11]); // b change not tracked
    a.set(2);
    expect(log).toEqual([11, 22]); // a change triggers re-run with new b
  });
});

describe('batch', () => {
  it('defers effect re-runs until the batch completes', () => {
    const x = signal(0);
    const y = signal(0);
    const log: string[] = [];
    effect(() => log.push(`x=${x()} y=${y()}`));
    expect(log).toEqual(['x=0 y=0']);

    batch(() => {
      x.set(1);
      y.set(1);
    });

    // Without batch there would be two entries; with batch only one additional run.
    expect(log).toEqual(['x=0 y=0', 'x=1 y=1']);
  });

  it('handles nested batches and only flushes at the outermost close', () => {
    const s = signal(0);
    const log: number[] = [];
    effect(() => log.push(s()));
    expect(log).toEqual([0]);

    batch(() => {
      batch(() => {
        s.set(1);
        s.set(2);
      });
      // Still inside outer batch — effect has not re-run yet.
      expect(log).toEqual([0]);
      s.set(3);
    });

    expect(log).toEqual([0, 3]);
  });

  it('manual subscribers still receive updates inside a batch', () => {
    const s = signal('a');
    const listener = vi.fn();
    s.subscribe(listener);

    batch(() => {
      s.set('b');
      s.set('c');
    });

    // Manual listeners are called eagerly (not deferred).
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith('c');
  });
});
