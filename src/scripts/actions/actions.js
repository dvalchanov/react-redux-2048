import actionTypes from "./actionTypes";
import {randomCell} from "js/helpers";
import {STARTING_TILES} from "js/constants";
import {newTile as newTileReducer} from "js/reducers/Game";

/**
 * Create a new random tile.
 */
export function newTile() {
  return (dispatch, getState) => {
    const state = getState().game;
    dispatch({
      type: actionTypes.NEW_TILE,
      cell: randomCell(state.get("cells"))
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
  return (dispatch, getState) => {
    let state = getState().game;
    dispatch({
      type: actionTypes.INIT_GAME,
      cells: _.times(STARTING_TILES, () => {
        const cell = randomCell(state.get("cells"));
        state = newTileReducer(state, cell);
        return cell;
      })
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
