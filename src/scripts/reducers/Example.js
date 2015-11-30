import {Map} from "immutable";
import actionTypes from "../actions/actionTypes";

const initialState = Map({});

/**
 * Example reducer.
 * NOTE: Change this to something that fits your app.
 *
 * - Example:
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
