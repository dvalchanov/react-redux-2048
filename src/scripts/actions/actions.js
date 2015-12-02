import actionTypes from "./actionTypes";

export function initTiles() {
  return dispatch => {
    dispatch({
      type: actionTypes.INIT_TILES
    });
  };
}

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
