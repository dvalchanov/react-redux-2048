import {Map} from "immutable";

const initialState = Map({});

/**
 * Example reducer.
 * NOTE: Change this to something that fits your app.
 *
 * - Example (use with actionTypes):
 *
 *   import actionTypes from "../actions/actionTypes";
 *
 *   case actionTypes.LOGIN:
 *     // Change state
 *     return state;
 *
 *   case actionTypes.LOGOUT:
 *     // Change state
 *     return state;
 */

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
