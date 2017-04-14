/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { reduxApiMiddleware } from './apiMiddleware';

/**
 * The default client store
 */
export function createClientStore(reducers, apiMiddlewareOverride) {
  const middlewares = [
    promiseMiddleware(),
    apiMiddlewareOverride || reduxApiMiddleware,
  ];

  if (process.env.NODE_ENV !== 'production') {
    try {
      // eslint-disable-next-line global-require, import/no-extraneous-dependencies
      middlewares.push(require('redux-logger').logger);
    } catch (error) {
      // Nothing to do here...
    }
  }

  const storeWithMiddleware = applyMiddleware(...middlewares)(createStore);
  return storeWithMiddleware(reducers, window.PreloadedState);
}

export const Provider = ({ store, children, ...rest }) => (
  <ReduxProvider store={store} {...rest}>
    {children}
  </ReduxProvider>
);

Provider.propTypes = {
  store: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
};
