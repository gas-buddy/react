/* global document, window */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

export function minimalEntryPoint({
  reducers,
  router: Router,
  initialState,
  rootSelector = '#container',
}) {
  const rootNode = document.querySelector(rootSelector);
  const supportsHistory = 'pushState' in window.history;
  let storeCreator = createStore;
  if (process.env.NODE_ENV !== 'production') {
    try {
      // eslint-disable-next-line global-require, import/no-extraneous-dependencies
      storeCreator = applyMiddleware([require('redux-logger').logger])(storeCreator);
    } catch (error) {
      // Nothing to do here...
    }
  }
  const store = storeCreator(reducers, initialState);

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
