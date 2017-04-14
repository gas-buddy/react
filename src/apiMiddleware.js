import fetch from 'isomorphic-fetch';

/**
 * This middleware generator allows you to dispatch actions with a meta:apiAction marker
 * that causes an API call to be made and the redux promise support to pass it to your
 * reducer with type actionName_FULFILLED after the call completes
 * (with _PENDING and _REJECTED actions as well)
 */
export const reduxApiMiddleware = store => next => (action) => {
  if (!action.payload || !action.meta || !action.meta.apiAction) {
    return next(action);
  }
  const request = action.payload;
  const promise = fetch(request.url, {
    credentials: 'include',
    method: action.meta.httpMethod || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Request-Source': 'ajax',
    },
    body: request.body ? JSON.stringify(request.body) : undefined,
  })
    .then(async (response) => {
      const { headers, status } = response;
      const body = await response.json();
      return { request, status, headers, body };
    })
    .catch(error => ({
      error,
      request,
    }));
  const { apiAction, ...meta } = action.meta;
  store.dispatch({
    ...action,
    meta,
    payload: promise,
  });
  return undefined;
};
