import {Map, List, Range, fromJS} from "immutable";
import actionTypes from "../actions/actionTypes";
import {randomNumber, isLucky} from "../utils/math";
import {generateCells, generateGrid} from "../lib/generate";
import store from "store2";
import _ from "lodash";

import {
  INITIAL,
  DIRECTIONS, VECTORS,
  UNITS,
  WIN_SCORE, START_SCORE
} from "../constants";

/**
 * New Random Tile
 *
 * newTile.js util/reducer ?
 */
let id = 0;
let initialState;
let savedState;
let defaultState;

if (store.get("game")) {
  const tiles = _.flatten(store.get("game").grid, true);
  const ids = _.pluck(tiles, "id");
  if (ids.length) {
    id = _.max(ids) + 1;
  }

  const game = store.get("game");
  game.fromSaved = true;
  savedState = fromJS(game);
}

defaultState = Map({
  win: null,
  score: START_SCORE,
  dimensions: List.of(UNITS, UNITS),
  cells: generateCells(UNITS, UNITS),
  grid: generateGrid(UNITS, UNITS),
  isActual: true,
  fromSaved: false,
  moved: false
});

initialState = savedState || defaultState;


/**
 * Get a random cell from the list of empty cells.
 *
 * @param {Object} state
 * @returns {Object}
 */
function randomCell(state) {
  const max = state.get("cells").size - 1;
  return randomNumber(0, max);
}

/**
 * Push a new tile into the chosen cell.
 *
 * @param {Object} state
 * @param {Object} tile
 * @returns {Object}
 */
function addTile(state, tile, value) {
  return state.updateIn(["grid", tile.get("x"), tile.get("y")], cell => {
    return cell.push(tile.merge({
      id: id++,
      value: value || INITIAL
    }));
  });
}

/**
 * Creates a new random tile in the grid by taking it from the list of
 * available empty tiles.
 *
 * @param {Object} state
 * @returns {Object}
 */
function newTile(state) {
  if (!state.get("cells").size) return state;

  const cell = randomCell(state);
  const tile = state.getIn(["cells", cell]);
  const x = state.get("grid").flatten(2).find(t => t.get("value") === "x");

  if (id > 1 && isLucky() && !x) state = addTile(state, tile, "x");
  else state = addTile(state, tile);

  return state.removeIn(["cells", cell]);
}


/**
 * Get a certain direction vectors.
 *
 * @param {Number} n
 * @returns {Object}
 */
function getVector(direction) {
  return VECTORS[direction];
}

/**
 * Get the current direction axis and value.
 *
 * @param {Object} direction
 * @returns {Object}
 */
function getCurrent(direction) {
  let axis;
  const directions = getVector(direction);

  for (const i in directions) {
    if ({}.hasOwnProperty.call(directions, i)) {
      if (directions[i] !== 0) {
        axis = i;
      }
    }
  }

  return {
    axis,
    value: directions[axis]
  };
}

/**
 * Check if the tile is suitable to be moved to the provided cell.
 *
 * @param {Object} cell
 * @param {Object} tile
 * @returns {Boolean}
 */
function isSuitable(cell, tile) {
  const t1 = cell.getIn([0, "value"]);
  const t2 = tile.get("value");

  if (cell.size > 1) return false;
  if (cell.size) {
    if (t1 === "x" || t2 === "x") return true;
    if (t1 !== t2) return false;
  }

  return true;
}

/**
 * Find an available cell for the tile to be moved in.
 *
 * @param {Object} state
 * @param {Object} tile
 * @param {Number} direction
 * @returns {Object}
 */
function findAvailableCell(state, tile, direction) {
  let available;
  const {axis, value} = getCurrent(direction);
  const from = tile.get(axis);
  const to = value < 0 ? (UNITS - 1) : 0;

  Range(to, from).forEach(index => {
    const path = (
      axis === "x" ?
      ["grid", index, tile.get("y")] :
      ["grid", tile.get("x"), index]
    );

    const cell = state.getIn(path);

    if (!isSuitable(cell, tile)) {
      available = null;
    } else {
      if (tile.get("value") === "x") {
        if (cell.size === 1 || (!cell.size && !available)) available = path;
      } else {
        available = available || path;
      }
    }
  });

  return available;
}

/**
 * Move the current tile to an available cell by following its path.
 *
 * @param {Object} state
 * @param {Object} tile
 * @param {Number} direction
 * @returns {Object}
 */
function moveTile(state, tile, direction) {
  const available = findAvailableCell(state, tile, direction);

  if (available) {
    state = state.set("isActual", false);
    state = state.updateIn(available, cell => cell.push(tile));
    state = state.updateIn(["grid", tile.get("x"), tile.get("y")], arr => {
      return arr.pop();
    });
  }

  return state;
}

/**
 * Sort the tiles by axis and its value. Reverse the list on negative value.
 *
 * @param {Object} tiles
 * @param {Number} direction
 * @returns {Object}
 */
function sortTiles(tiles, direction) {
  const {axis, value} = getCurrent(direction);
  tiles = tiles.sortBy(tile => tile.get(axis));
  if (value < 0) tiles = tiles.reverse();
  return tiles;
}

/**
 * Move each of the passed tiles.
 *
 * @param {Object} state
 * @param {Object} tiles
 * @param {Object} direction
 * @returns {Object}
 */
function moveTiles(state, tiles, direction) {
  tiles.forEach(tile => state = moveTile(state, tile, direction));
  return state;
}

/**
 * Move the tile objects to their new cells positions, without changing
 * their canvas position yet.
 *
 * @param {Object} state
 * @param {Object] direction
 * @returns {Object}
 */
// TODO - Fix
function prepareTiles(state, direction) {
  let initial = state;
  let tiles = state.get("grid").flatten(2);

  tiles = sortTiles(tiles, direction);
  state = moveTiles(state, tiles, direction);

  // TODO - fix
  if (initial === state) {
    initial = initial.set("moved", true);

    let gameOver = true;
    const rest = _.without(_.values(DIRECTIONS), direction);

    _.each(rest, (d) => {
      tiles = sortTiles(tiles, d);
      state = moveTiles(state, tiles, d);

      if (initial !== state) gameOver = false;
    });

    state = gameOver ? state.set("win", false) : initial;
  }


  return state;
}


/**
 * Loop through each cell in the provided grid.
 *
 * @param {Object} grid
 * @param {Function} cb
 */
function forEachAvailableCell(grid, cb) {
  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell.size) {
        cb({cell, x, y});
      }
    });
  });
}

/**
 * Actualize the tiles if their grid positions
 * is not the same as their actual position.
 *
 * @param {Object} state
 * @returns {Object}
 */
function actualize(state) {
  let grid = state.get("grid");

  forEachAvailableCell(grid, ({cell, x, y}) => {
    cell.forEach((tile, index) => {
      if (tile.get("x") !== x || tile.get("y") !== y) {
        grid = grid.updateIn([x, y, index], t => t.merge({x, y}));
      }
    });
  });

  return state.merge({
    fromSaved: false,
    isActual: true,
    grid
  });
}

/**
 * Merge tiles and update the empty cells list.
 *
 * @param {Object} state
 * @returns {Object}
 */
// TODO - separate
function mergeTiles(state) {
  let cells = List();
  let grid = state.get("grid");
  let result = 0;

  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (!cell.size) {
        cells = cells.push(Map({x, y}));
      }

      if (cell.size > 1) {
        const newValue = cell.reduce((t1, t2) => {
          if (t1.get("value") === "x") return t2.get("value") * 2;
          if (t2.get("value") === "x") return t1.get("value") * 2;
          return t1.get("value") + t2.get("value");
        });

        if (newValue === WIN_SCORE) state = state.set("win", true);

        const tile = cell.first().merge({
          value: newValue,
          id: id++
        });

        state = state.set("score", state.get("score") + newValue);
        grid = grid.setIn([x, y], List.of(tile));

        result += newValue;
      }
    });
  });

  return state.merge({
    cells, result, grid,
    moved: false
  });
}

/**
 * Save the game to be continued another time.
 *
 * @param {Object} state
 * @returs {Object}
 */
function saveGame(state) {
  store("game", state.toJS());
}

/**
 * Default Reducer
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_TILE:
      return newTile(state);

    case actionTypes.MOVE_TILES:
      return prepareTiles(state, action.direction);

    case actionTypes.ACTUALIZE:
      return actualize(state);

    case actionTypes.MERGE_TILES:
      return mergeTiles(state);

    case actionTypes.RESTART_GAME:
      store(false);
      state = defaultState;
      // Not here!
      state = newTile(state);
      state = newTile(state);
      return state;

    case actionTypes.GAME_OVER:
      state = state.set("win", false);
      return state;

    case actionTypes.SAVE_GAME:
      saveGame(state);
      return state;

    case actionTypes.RESET_RESULT:
      state = state.set("result", START_SCORE);
      return state;

    case actionTypes.SET_MOVED:
      return state.set("moved", action.moved);

    default:
      return state;
  }
};
