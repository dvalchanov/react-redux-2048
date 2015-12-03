import actionTypes from "./actionTypes";

export function newTile() {
  return dispatch => {
    dispatch({
      type: actionTypes.NEW_TILE
    });
  };
}

export function slideTiles() {
  return dispatch => {
    dispatch({
      type: actionTypes.SLIDE_TILES
    });
  };
}

export function actualize() {
  return dispatch => {
    dispatch({
      type: actionTypes.ACTUALIZE
    });
  };
}
/**
 * Define all of your actions here.
 *
 * - Example:
 *
 *   export function name(params) {
 *     return dispatch => {
 *       dispatch({});
 *     });
 *   }
 */
