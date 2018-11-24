/* global document, window */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, Provider } from './store';

export function minimalEntryPoint({
  reducers,
  router: Router,
  initialState,
  rootSelector = '#container',
}) {
  const rootNode = document.querySelector(rootSelector);
  const supportsHistory = 'pushState' in window.history;
  const store = createStore({ reducers, initialState });

  const render = (Component) => {
    ReactDOM.render((
      <BrowserRouter forceRefresh={!supportsHistory}>
        <Provider store={store}>
          <Component />
        </Provider>
      </BrowserRouter>
    ), rootNode);
  };

  render(Router);
}
