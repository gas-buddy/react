import React from 'react';
import PropTypes from 'prop-types';
import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { reduxApiMiddleware } from './apiMiddleware';

/**
 * The default client store
 */
export function createStore({ reducers, initialState, apiMiddleware }) {
  const middlewares = [
    promiseMiddleware(),
    apiMiddleware || reduxApiMiddleware,
  ];

  if (process.env.NODE_ENV !== 'production') {
    try {
      // eslint-disable-next-line global-require, import/no-extraneous-dependencies
      middlewares.push(require('redux-logger').logger);
    } catch (error) {
      // Nothing to do here...
    }
  }

  const storeWithMiddleware = applyMiddleware(...middlewares)(reduxCreateStore);
  return storeWithMiddleware(reducers, initialState);
}

export const Provider = ReduxProvider;
