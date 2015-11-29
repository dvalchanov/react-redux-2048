import actionTypes from "./actionTypes";

export function login(user) {
  return dispatch => {
    dispatch({
      isAuthenticated: true,
      user
    });
  });
}
