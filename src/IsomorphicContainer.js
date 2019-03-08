/* globals window */
import { Container } from 'unstated';

function defaultStateName(container) {
  const { name } = container.constructor;
  return name.replace(/Container$/, '');
}

/**
 * This is a base class for unstated containers that will
 * pull from req.initialState on the server (via the unstated-decorator in config)
 * and window.PreloadedState on the browser. The name of the PreloadedState key
 * can be passed as a second constructor param, else we will look for the
 * class name w/o "Container" at the end.
 */
export default class IsomorphicContainer extends Container {
  constructor(initialState, preloadedStateName) {
    super();
    let state = initialState;
    if (!state && typeof window !== 'undefined') {
      state = window?.PreloadedState?.[preloadedStateName || defaultStateName(this)];
    }
    if (!state) {
      state = {};
    }
    this.state = state;
  }

  toJSON() {
    return this.state;
  }
}
