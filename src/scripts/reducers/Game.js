import {Map} from "immutable";
import actionTypes from "../actions/actionTypes";

const initialState = Map({
  score: 0,
  won: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_GAME:
    case actionTypes.RESTART_GAME:
    case actionTypes.GAME_OVER:
    case actionTypes.SAVE_GAME:

    default:
      return state;
  }
};
