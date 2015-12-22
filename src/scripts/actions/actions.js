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

export function initGame() {
  return dispatch => {
    dispatch({
      type: actionTypes.INIT_GAME
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

export function resetResult() {
  return dispatch => {
    dispatch({
      type: actionTypes.RESET_RESULT
    });
  };
}

export function setMoved(moved) {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_MOVED,
      moved
    });
  };
}
