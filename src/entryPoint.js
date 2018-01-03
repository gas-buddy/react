/* global document, window */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore, Provider } from './store';

export function entryPoint({
  reducers,
  router: Router,
  initialState,
  apiMiddleware,
  rootSelector = '#container',
}) {
  const rootNode = document.querySelector(rootSelector);
  const supportsHistory = 'pushState' in window.history;
  const store = createStore({ reducers, initialState, apiMiddleware });

  const render = (Component) => {
    ReactDOM.render((
      <AppContainer>
        <BrowserRouter forceRefresh={!supportsHistory}>
          <Provider store={store}>
            <Component />
          </Provider>
        </BrowserRouter>
      </AppContainer>
    ), rootNode);
  };

  render(Router);
}
