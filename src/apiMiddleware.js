import { fetchApi } from './fetchApi';

/**
 * This middleware generator allows you to dispatch actions with a meta:apiAction marker
 * that causes an API call to be made and the redux promise support to pass it to your
 * reducer with type actionName_FULFILLED after the call completes
 * (with _PENDING and _REJECTED actions as well)
 *
 * DEPRECATED - It seems like it would be better to use fetchApi directly as the
 * payload to an action and let the existing promise middleware do the work.
 */
export const reduxApiMiddleware = store => next => (action) => {
  if (!action.payload || !action.meta || !action.meta.apiAction) {
    return next(action);
  }
  const request = action.payload;
  const promise = fetchApi({
    body: request.body,
    url: request.url,
    method: action.meta.httpMethod || 'POST',
    catchErrors: true,
  });
  const { apiAction, ...meta } = action.meta;
  store.dispatch({
    ...action,
    meta,
    payload: promise,
  });
  return undefined;
};
