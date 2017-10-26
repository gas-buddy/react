import PropTypesModule from 'prop-types';

export * from './apiMiddleware';
export * from './store';
export * from './router';
export * from './entryPoint';
export * from './WithData';
export * from './fetchApi';

export { default as React, cloneElement } from 'react';
export { connect } from 'react-redux';
export { Link, NavLink, Redirect, withRouter, StaticRouter } from 'react-router-dom';
export const PT = PropTypesModule;
export const PropTypes = PropTypesModule;
export { default as ReactDOMServer, renderToString, renderToStaticMarkup } from 'react-dom/server';
export { combineReducers } from 'redux';
