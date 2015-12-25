import actionTypes from "./actionTypes";

/**
 * Create a new random tile.
 */
export function newTile() {
  return dispatch => {
    dispatch({
      type: actionTypes.NEW_TILE
    });
  };
}

/**
 * Move the tiles in the chose direction.
 *
 * @param {Number} direction
 */
export function moveTiles(direction) {
  return dispatch => {
    dispatch({
      type: actionTypes.MOVE_TILES,
      direction
    });
  };
}

/**
 * Actualize the tiles positions.
 */
export function actualize() {
  return dispatch => {
    dispatch({
      type: actionTypes.ACTUALIZE
    });
  };
}

/**
 * Merge tiles if more than one in one cell.
 */
export function mergeTiles() {
  return dispatch => {
    dispatch({
      type: actionTypes.MERGE_TILES
    });
  };
}

/**
 * Initialize a new game.
 */
export function initGame() {
  return dispatch => {
    dispatch({
      type: actionTypes.INIT_GAME
    });
  };
}

/**
 * Save the current game.
 */
export function saveGame() {
  return dispatch => {
    dispatch({
      type: actionTypes.SAVE_GAME
    });
  };
}

/**
 * Reset the merging tiles result field for the current move.
 */
export function resetResult() {
  return dispatch => {
    dispatch({
      type: actionTypes.RESET_RESULT
    });
  };
}
