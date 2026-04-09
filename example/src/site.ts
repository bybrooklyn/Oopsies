import {
  button,
  component,
  container,
  getTheme,
  grid,
  heading,
  link,
  row,
  stack as stackBuilder,
  surface,
  text,
  toggleTheme,
  type Child,
  type ComponentContext,
  type UIElement,
} from 'oopsies';

export type NavKey = 'home' | 'getting-started' | 'examples' | 'playground' | 'about';

type NavItem = {
  href: string;
  key: NavKey;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', href: '/index.html' },
  { key: 'getting-started', label: 'Get Started', href: '/docs/getting-started.html' },
  { key: 'examples', label: 'Examples', href: '/docs/examples.html' },
  { key: 'playground', label: 'Playground', href: '/playground.html' },
  { key: 'about', label: 'About', href: '/about.html' },
];

function compact(children: Child[]): UIElement[] {
  return children.filter(Boolean) as UIElement[];
}

export function stack(className: string, children: UIElement[] = [], gap = 'var(--space-4)') {
  return stackBuilder({ children, className, gap });
}

export function paragraph(content: string, className = 'body-copy') {
  return text(content, { className });
}

export function eyebrow(content: string) {
  return text(content, { className: 'eyebrow' });
}

export function sectionHeading(level: 1 | 2 | 3, content: string, className: string) {
  return heading(level, content, { className });
}

export function actionLink(label: string, href: string, tone: 'primary' | 'secondary' | 'quiet' = 'primary') {
  return link(label, href, { className: `button-link button-link-${tone}` });
}

export function actionButton(
  label: string,
  tone: 'primary' | 'secondary' | 'ghost',
  onClick: () => void,
) {
  return button(label, { className: `demo-button demo-button-${tone}` }).onClick(onClick);
}

export function codeBlock(label: string, lines: string[]) {
  return stackBuilder({
    children: [text(label, { className: 'code-label' }), ...lines.map((line) => text(line, { className: 'code-line' }))],
    className: 'code-card',
    gap: 'var(--space-2)',
  }).padding('var(--space-4)');
}

export function statCard(value: string, labelText: string) {
  return surface({
    body: stackBuilder({
      children: [text(value, { className: 'stat-value' }), text(labelText, { className: 'stat-label' })],
      className: 'stat-card',
      gap: 'var(--space-2)',
    }),
    className: 'stat-card-shell',
    gap: 'var(--space-2)',
    pad: '0',
  });
}

export function featureCard(kicker: string, title: string, copy: string) {
  return surface({
    body: stackBuilder({
      children: [text(kicker, { className: 'card-kicker' }), sectionHeading(3, title, 'card-title'), paragraph(copy, 'card-copy')],
      className: 'feature-card',
      gap: 'var(--space-3)',
    }),
    className: 'feature-card-shell',
  });
}

export function stepCard(index: string, title: string, copy: string) {
  return surface({
    body: stackBuilder({
      children: [text(index, { className: 'step-index' }), sectionHeading(3, title, 'card-title'), paragraph(copy, 'card-copy')],
      className: 'step-card',
      gap: 'var(--space-3)',
    }),
    className: 'step-card-shell',
  });
}

export function docCard(title: string, copy: string, href: string) {
  return surface({
    body: stackBuilder({
      children: [sectionHeading(3, title, 'card-title'), paragraph(copy, 'card-copy')],
      className: 'doc-card',
      gap: 'var(--space-3)',
    }),
    className: 'doc-card-shell',
    footer: link('Open page', href, { className: 'inline-link' }),
  });
}

export function compareCard(kicker: string, title: string, copy: string) {
  return surface({
    body: stackBuilder({
      children: [text(kicker, { className: 'card-kicker' }), sectionHeading(3, title, 'card-title'), paragraph(copy, 'card-copy')],
      className: 'compare-card',
      gap: 'var(--space-3)',
    }),
    className: 'compare-card-shell',
  });
}

export function noteCard(title: string, copy: string) {
  return surface({
    body: stackBuilder({
      children: [sectionHeading(3, title, 'card-title'), paragraph(copy, 'card-copy')],
      className: 'note-card',
      gap: 'var(--space-3)',
    }),
    className: 'note-card-shell',
  });
}

export function bulletList(items: string[]) {
  return stackBuilder({
    children: items.map((item) => text(item, { className: 'list-item' })),
    className: 'list-stack',
    gap: 'var(--space-3)',
  });
}

const ThemeButton = component('ThemeButton', (_: Record<string, never>, ctx: ComponentContext) => {
  const currentTheme = ctx.state(getTheme());

  return button(currentTheme() === 'dark' ? 'Light mode' : 'Dark mode', {
    className: 'button-link button-link-secondary theme-toggle',
  }).onClick(() => {
    currentTheme.set(toggleTheme());
  });
});

const SiteHeader = component<{ current: NavKey }>('SiteHeader', (props) => {
  return surface({
    body: row({
      align: 'center',
      children: [
        stackBuilder({
          children: [
            link('OOPSIES', '/index.html', { className: 'wordmark' }),
            text('TypeScript UI with TOML styling', { className: 'brand-note' }),
          ],
          className: 'site-brand',
          gap: 'var(--space-1)',
        }),
        row({
          align: 'center',
          children: [
            ...NAV_ITEMS.map((item) =>
              link(item.label, item.href, {
                className: item.key === props.current ? 'site-nav-link is-current' : 'site-nav-link',
              }),
            ),
            ThemeButton({}),
          ],
          className: 'site-nav',
          gap: 'var(--space-2)',
          justify: 'flex-end',
        }),
      ],
      className: 'site-header',
      justify: 'space-between',
      wrap: true,
    }),
    className: 'site-header-shell',
    pad: 'var(--surface-pad-sm)',
  });
});

const SiteFooter = component('SiteFooter', () => {
  return surface({
    body: row({
      align: 'flex-start',
      children: [
        stackBuilder({
          children: [
            text('OOPSIES is built for people who want a smaller, more explicit UI model.', { className: 'footer-copy' }),
            text('The example app you are looking at is itself built in OOPSIES.', { className: 'footer-copy' }),
          ],
          className: 'footer-copy-group',
          gap: 'var(--space-2)',
        }),
        stackBuilder({
          children: [
            link('Get started', '/docs/getting-started.html', { className: 'footer-link' }),
            link('Examples', '/docs/examples.html', { className: 'footer-link' }),
            link('Playground', '/playground.html', { className: 'footer-link' }),
            link('About', '/about.html', { className: 'footer-link' }),
          ],
          className: 'footer-links',
          gap: 'var(--space-2)',
        }),
      ],
      className: 'site-footer',
      justify: 'space-between',
      wrap: true,
    }),
    className: 'site-footer-shell',
  });
});

export function sectionBlock(kicker: string, title: string, lead: string, children: UIElement[]) {
  return surface({
    body: stackBuilder({
      children: compact([
        stackBuilder({
          children: [eyebrow(kicker), sectionHeading(2, title, 'section-title'), paragraph(lead, 'section-lede')],
          className: 'section-intro',
          gap: 'var(--space-3)',
        }),
        ...children,
      ]),
      className: 'content-section',
      gap: 'var(--space-5)',
    }),
    className: 'content-section-shell',
  });
}

export function pageHero(title: string, lead: string, children: UIElement[]) {
  return surface({
    body: stackBuilder({
      children: [sectionHeading(1, title, 'page-title'), paragraph(lead, 'hero-lede'), ...children],
      className: 'page-hero',
      gap: 'var(--space-5)',
    }),
    className: 'page-hero-shell',
    pad: 'var(--surface-pad-lg)',
  });
}

export function sitePage(current: NavKey, hero: UIElement, sections: UIElement[]) {
  return container({
    children: [
      SiteHeader({ current }),
      stackBuilder({ children: [hero, ...sections], className: 'site-main', gap: 'var(--space-6)' }),
      SiteFooter({}),
    ],
    className: 'site-shell',
    max: 'var(--page-max)',
    pad: '1rem',
  })
    .padding('var(--space-5) 1rem var(--space-8)')
    .width('min(var(--page-max), calc(100% - 2rem))');
}

export function setPageTitle(title: string): void {
  document.title = `OOPSIES | ${title}`;
}
