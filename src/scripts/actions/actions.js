import actionTypes from "./actionTypes";
import {DIRECTIONS} from "../constants";

export function newTile() {
  return dispatch => {
    dispatch({
      type: actionTypes.NEW_TILE
    });
  };
}

export function moveTiles(keyCode) {
  return dispatch => {
    const direction = DIRECTIONS[keyCode];

    if (typeof direction !== "undefined") {
      dispatch({
        type: actionTypes.MOVE_TILES,
        direction
      });
    }
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
