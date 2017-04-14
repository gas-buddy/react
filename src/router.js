import React from 'react';
import { Switch, Route } from 'react-router-dom';

function prefixedPath(prefix, path) {
  // Two slashes means an absolute path
  if (path && path.substring(0, 2) === '//') {
    return path.substring(1);
  }
  if (path) {
    return `${prefix}${path}`;
  }
  return prefix || '/';
}

function populatePathArray(pathArray, prefix, routeSpec) {
  const { routes, ...rest } = routeSpec || {};
  let routesToRecurse = rest;
  if (Array.isArray(routes)) {
    for (const r of routes) {
      pathArray.push({
        ...r,
        key: pathArray.length,
        path: prefixedPath(prefix, r.path),
      });
    }
  } else if (typeof routes === 'object') {
    routesToRecurse = routeSpec;
  }
  if (routesToRecurse) {
    for (const [subpath, spec] of Object.entries(routesToRecurse)) {
      populatePathArray(pathArray, `${prefix}/${subpath}`, spec);
    }
  }
}

/**
 * Create a react router from configuration. The shape of the routes property should be something
 * like:
 * {
 *  routes: [
 *    {component: <some_component>, exact: true},
 *    {component: <another_one>, exact: true, path: 'hello' },
 *  ],
 *  world: {
 *    routes: [{component: <yet_another>, exact: true}],
 *  }
 * }
 * That would create the following routes:
 *  / mapped to some_component
 *  /hello mapped to another_one
 *  /world mapped to yet_another
 *
 * Note that if the "routes" key is an object and not an array, we assume
 * you meant you wanted a "routes" part of the path
 */
export const RouterThunk = (routes) => {
  const paths = [];
  populatePathArray(paths, '', routes);

  // in here until react-router-config cleans up it's act
  return () => (
    <Switch>
      {paths.map(route => (
        <Route
          exact={route.exact}
          key={route.key}
          path={route.path}
          strict={route.strict}
          render={props => (
            <route.component {...props} route={route} />
          )}
        />
      ))}
    </Switch>
  );
};
