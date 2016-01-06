import {Component} from "react";
import {applyMiddleware, compose} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import {createStore, renderDevTools} from "js/utils/devTools";
import reducers from "js/reducers";
import Game from "./Game";

/**
 * Compose a new store from the passed reducers and apply a thunk middleware.
 */
const store = compose(
  applyMiddleware(thunk)
)(createStore)(reducers);

/**
 * Default component, that sets and connects the store to its children.
 * Render Development Tools if in DEBUG mode.
 */
export default class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Game />
        </Provider>
        {renderDevTools(store)}
      </div>
    );
  }
}
