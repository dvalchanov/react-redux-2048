import {fromJS} from "immutable";
import actionTypes from "../actions/actionTypes";

const initialState = fromJS({
  isAuthenticated: false,
  user: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
    case actionTypes.SIGN_UP:
    case actionTypes.LOGOUT:
    default:
      return state;
  }
}
