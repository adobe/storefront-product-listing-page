import type {
  Breadcrumb,
  EventHint,
  Options,
  Primitive,
  Scope,
  User,
} from '@sentry/types';
import { createContext } from 'preact';
import { useEffect, useErrorBoundary, useState } from 'preact/hooks';

import packageJson from '../../package.json';

const { version } = packageJson;

type SeverityLevels =
  | 'debug'
  | 'info'
  | 'warning'
  | 'log'
  | 'error'
  | 'fatal'
  | 'critical';

export type SentryType = {
  onLoad?: (callback: () => void) => void;
  init?: (options: Options) => void;
  captureMessage: (
    message: string,
    level?: SeverityLevels,
    hint?: EventHint,
    scope?: Scope
  ) => string | undefined;
  captureException: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exception: any,
    hint?: EventHint,
    scope?: Scope
  ) => string | undefined;
  configureScope: (callback: (scope: Scope) => void) => void;
  Severity: { [key: string]: SeverityLevels };
  withScope: (callback: (scope: Scope) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Integrations: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setContext: (name: string, context: { [key: string]: any } | null) => void;
  setUser: (user: User) => void;
  setTag: (key: string, value: Primitive) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb, maxBreadcrumbs?: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Scope?: Scope & { prototype: any } & EventHint;
  SDK_VERSION: string;
};

export const SentryContext = createContext<any>({});

const sentryInit = (cb: (SentryObj: any) => void): void => {
  if (typeof Sentry === 'undefined') {
    return;
  }
  const isProd = process.env.NODE_ENV === 'production';
  const ignoreErrors = [
    // intentional errors
    'Store details not found',

    // Magento Ui errors
    'ResizeObserver loop', // Spectrum's bug
    'Magento_Ui',
    'Magento_Cms',
    'Magento_ReCaptchaFrontendUi',
    'unexpected token: keyword',
    // jQuery errors
    'Uncaught ReferenceError: jQuery is not defined',
    'jQuery is not defined',
    'jquery',
    'Uncaught TypeError: $ is not a function',
    '$(...) is null',
    '$.mage.isDevMode',
    // third party plugin errors
    'oct8ne is not defined',
    'livechat_visitor_data',
    'woObj.crossSellsSlider is not a function',
    '//cdn.jst.ai/vck.js',
    'mixin is not a function',
    'Smile_ElasticsuiteCatalog',
    'js-cookie/js.cookie"',
  ];
  const denyUrls = [
    'https://magento.com',
    'https://magento2.com',
    'https://magento2.docker',
    'require.js',
    'jquery-migrate.js',
    'js.storage.min.js',
    'tab.min.js',
    'Grammarly-check.js',
    'Grammarly.js',
    'https://assets.adobedtm.com/',
    /Trustpilot_Reviews\/js/,
  ];

  const tracesSampleRate = isProd ? 0.5 : 1; // Capture 100% of the transactions, reduce in production!
  const replaysSessionSampleRate = isProd ? 0.5 : 0.1; // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  const replaysOnErrorSampleRate = 1; // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.

  if (typeof Sentry.onLoad === 'function') {
    Sentry.onLoad(() => {
      Sentry.init({
        release: `ds-search-plp@${version}`,
        environment: process.env.NODE_ENV, // 'qa' || 'production'
        integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
        tracesSampleRate,
        replaysSessionSampleRate,
        replaysOnErrorSampleRate,
        ignoreErrors,
        denyUrls,
      });
      cb(Sentry);
    });
  }
};

export const SentryProvider = ({ children }: { children: any }) => {
  const [error] = useErrorBoundary();
  const [sentryLoaded, setSentryLoaded] = useState(false);
  const [Sentry, setSentry] = useState<SentryType>({} as SentryType);

  useEffect(() => {
    if (error) {
      // loading sentry onto storefront does not trigger captureMessage automatically.
      // requires manually send.
      Sentry.captureMessage(error, 'error');
    }
  }, [error]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      // disable sentry in local development mode
      return;
    }
    if (sentryLoaded && Sentry.onLoad) {
      return;
    }
    const sentryUrl =
      'https://js.sentry-cdn.com/c166f09be0d04a34b7c997502232183b.min.js';
    const script = document.createElement('script');
    script.src = sentryUrl;

    script.async = true;
    script.crossOrigin = 'anonymous';
    script.type = 'application/javascript';

    script.addEventListener('load', () => {
      sentryInit((s) => {
        setSentry(s);
        setSentryLoaded(true);
      });
    });

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }, [document]);

  return (
    <SentryContext.Provider value={Sentry}>{children}</SentryContext.Provider>
  );
};
