/* global document, window */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';

export function routerOnlyEntryPoint({
  router: Router,
  rootSelector = '#container',
}) {
  const rootNode = document.querySelector(rootSelector);
  const supportsHistory = 'pushState' in window.history;

  const render = (Component) => {
    ReactDOM.hydrate((
      <BrowserRouter forceRefresh={!supportsHistory}>
        <Component />
      </BrowserRouter>
    ), rootNode);
  };

  loadableReady(() => render(Router));
}
