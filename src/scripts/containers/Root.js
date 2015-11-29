import React, {Component} from "react";
import {createHistory} from "history";
import {applyMiddleware, compose} from "redux";
import {Redirect, Router, Route} from "react-router";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import {createStore, renderDevTools} from "../utils/devTools";
import reducers from "../reducers";
import App from "./App";

const store = compose(
  applyMiddleware(thunk)
)(createStore)(reducers);

const history = createHistory();

export default class Root extends Component {
  render() {
    return(
      <div>
        <Provider store={store}>
          <Router history={history}>
            <Route component={App} path="/">
            </Route>
          </Router>
        </Provider>
        {renderDevTools(store)}
      </div>
    );
  }
}
