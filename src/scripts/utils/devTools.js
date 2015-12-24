import {createStore as initialCreateStore, compose} from "redux";
import {devTools, persistState} from "redux-devtools";
import {DevTools, DebugPanel, LogMonitor} from "redux-devtools/lib/react";

export let createStore = initialCreateStore;

/**
 * Apply devTools enhancer if in development mode, otherwise just use
 * the original `createStore` function.
 */
if (__DEV__) {
  createStore = compose(
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
}

/**
 * Render the Debug panel if in development mode.
 *
 * @param {Object} store
 * @returns {Object}
 */
export function renderDevTools(store) {
  if (__DEV__) {
    return (
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    );
  }
}
