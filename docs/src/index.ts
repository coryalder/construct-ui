import 'highlight.js/styles/github-gist.css';
import './style.scss';
import './favicon.ico';
import m from 'mithril';
import Main from './components/Main';
import { highlightCode } from './utils/highlightCode';
import { IMarkdownPluginData, ITypescriptPluginData } from '@documentalist/client';
import { normalizeDocs } from './utils/normalizeDocs';

export type Data = IMarkdownPluginData & ITypescriptPluginData;

// tslint:disable-next-line:no-var-requires
const docs = normalizeDocs(require('../generated/docs.json') as Data);

export interface IDocumentationData {
  docs: IMarkdownPluginData & ITypescriptPluginData;
  page: string;
  requestedPath: string;
}

export const GITHUB_ROOT = 'https://github.com/vasilrimar/construct-ui';
export const DEFAULT_ROOT = '/introduction/getting-started';

m.route.prefix = '#';

const resolveRoute = (wrapper: m.Component) => ({
  onmatch(attrs, requestedPath) {
    attrs.docs = docs;
    attrs.requestedPath = requestedPath;

    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      highlightCode();
    });
  },
  render({ attrs }) {
    return m(wrapper, { ...attrs });
  }
}) as m.RouteResolver<IDocumentationData>;

const initRoutes = (layout: any) => {
  m.route(document.getElementById('Docs')!, DEFAULT_ROOT, {
    '/introduction/:page': resolveRoute(layout),
    '/components/:page...': resolveRoute(layout),
    '/utils/:page...': resolveRoute(layout)
  });
};

initRoutes(Main);

if (module.hot) {
  module.hot.accept('./components/Main', () => {
    const main = require('./components/Main').default;
    initRoutes(main);
  });
}

requestAnimationFrame(() => highlightCode());
