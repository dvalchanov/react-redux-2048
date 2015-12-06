import actionTypes from "./actionTypes";

export function newTile() {
  return dispatch => {
    dispatch({
      type: actionTypes.NEW_TILE
    });
  };
}

export function moveTiles(keyCode) {
  return dispatch => {
    dispatch({
      type: actionTypes.MOVE_TILES,
      keyCode
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

export function mergeTiles() {
  return dispatch => {
    dispatch({
      type: actionTypes.MERGE_TILES
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
