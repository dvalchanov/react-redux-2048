import React from "react";
import {createStore as initialCreateStore, compose} from "redux";
import {devTools, persistState} from "redux-devtools";
import {DevTools, DebugPanel, LogMonitor} from "redux-devtools/lib/react";

export let createStore = initialCreateStore;

if (__DEV__) {
  createStore = compose(
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
}

export function renderDevTools(store) {
  if (__DEV__) {
    return (
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    );
  }
}
