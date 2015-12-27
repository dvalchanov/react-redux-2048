import {Component} from "react";
import {applyMiddleware, compose} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import {createStore, renderDevTools} from "js/utils/devTools";
import reducers from "js/reducers";
import Game from "./Game";

const store = compose(
  applyMiddleware(thunk)
)(createStore)(reducers);

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
