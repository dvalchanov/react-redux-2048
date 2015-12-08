import actionTypes from "./actionTypes";

export function newTile() {
  return dispatch => {
    dispatch({
      type: actionTypes.NEW_TILE
    });
  };
}

export function moveTiles(direction) {
  return dispatch => {
    dispatch({
      type: actionTypes.MOVE_TILES,
      direction
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

export function restartGame() {
  return dispatch => {
    dispatch({
      type: actionTypes.RESTART_GAME
    });
  };
}

export function saveGame() {
  return dispatch => {
    dispatch({
      type: actionTypes.SAVE_GAME
    });
  };
}
