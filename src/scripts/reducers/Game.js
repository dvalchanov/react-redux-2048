import {Map, List, Range, fromJS} from "immutable";
import store from "store2";
import _ from "lodash";
import actionTypes from "js/actions/actionTypes";
import luckio from "luckio";
import {getCurrent} from "js/utils/vectors";

import {
  generateCells,
  generateGrid,
  forEachCell
} from "js/helpers";

import {
  INITIAL,
  DIRECTIONS,
  SIZE,
  WIN_SCORE, START_SCORE
} from "js/constants";

/**
 * ID counter.
 */
let id = 0;

/**
 * Set a lucky function with 1% chance.
 */
const isLucky = luckio(1);

/**
 * Default starting state.
 */
const defaultState = Map({
  win: null,
  score: START_SCORE,
  cells: generateCells(SIZE, SIZE),
  grid: generateGrid(SIZE, SIZE),
  isActual: true,
  fromSaved: false
});

/**
 * Set the initial state according to whether there is a saved game.
 */
const initialState = startSavedGame() || defaultState;

/**
 * Start the game from a saved position if there is such.
 *
 * @returns {}
 */
function startSavedGame() {
  const game = store.get("game");

  if (game) {
    const tiles = _.flatten(game.grid, true);
    const ids = _.pluck(tiles, "id");
    if (ids.length) id = _.max(ids) + 1;
    game.fromSaved = true;
    return fromJS(game);
  }
}

/**
 * Push a new tile into the chosen empty cell.
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
export function newTile(state, cell) {
  if (!state.get("cells").size) return state;

  const tile = state.getIn(["cells", cell]);
  const x = state.get("grid").flatten(2).find(t => t.get("value") === "x");

  if (id > 1 && isLucky() && !x) state = addTile(state, tile, "x");
  else state = addTile(state, tile);

  return state.removeIn(["cells", cell]);
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
  const to = value < 0 ? (SIZE - 1) : 0;

  Range(to, from).forEach(index => {
    const path = (
      axis === "x" ?
      ["grid", index, tile.get("y")] :
      ["grid", tile.get("x"), index]
    );

    const cell = state.getIn(path);

    if (!isSuitable(cell, tile)) {
      available = null;
      return;
    }

    if (tile.get("value") === "x") {
      if (cell.size === 1 || (!cell.size && !available)) available = path;
    } else {
      available = available || path;
    }
  });

  return available;
}

/**
 * Move the current tile to an available cell by following the provided available path.
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
    state = state.updateIn(["grid", tile.get("x"), tile.get("y")], arr => arr.pop());
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
 * Move the tiles in a certain direction. If not possible, check if the other
 * directions are available. If not, end the game. If available, just return the
 * current state (which will let the user adjust direction on next try).
 *
 * @param {Object} state
 * @param {Object] direction
 * @returns {Object}
 */
function moveInDirection(state, direction) {
  let initial = state;
  let directions = _.values(DIRECTIONS);
  let tiles = state.get("grid").flatten(2);

  const check = (current) => {
    if (current !== direction) initial = state;

    directions = _.without(directions, current);
    tiles = sortTiles(tiles, current);
    state = moveTiles(state, tiles, current);

    if (initial === state) {
      if (directions.length) return check(directions[0]);
      return state.set("win", false);
    }

    return (current !== direction) ? initial : state;
  };

  return check(direction);
}

/**
 * Actualize the tiles if their grid positions is not the same as their actual position.
 *
 * @param {Object} state
 * @returns {Object}
 */
function actualize(state) {
  let grid = state.get("grid");

  forEachCell(grid, ({cell, x, y}) => {
    if (!cell.size) return;
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
 * Calculate the result of merging two tiles. Take in consideration that there
 * could be an X-tile, which doubles the result of the other tile.
 *
 * @param {Object} t1
 * @param {Object} t2
 * @return {Number}
 */
function calculateTiles(t1, t2) {
  if (t1.get("value") === "x") return t2.get("value") * 2;
  if (t2.get("value") === "x") return t1.get("value") * 2;
  return t1.get("value") + t2.get("value");
}

/**
 * Merge tiles and update the empty cells list.
 *
 * @param {Object} state
 * @returns {Object}
 */
function mergeTiles(state) {
  let cells = List();
  let grid = state.get("grid");
  let result = 0;

  forEachCell(grid, ({cell, x, y}) => {
    if (!cell.size) cells = cells.push(Map({x, y}));
    if (cell.size > 1) {
      const value = cell.reduce((t1, t2) => calculateTiles(t1, t2));

      result += value;
      grid = grid.updateIn([x, y], () => List.of(cell.first().merge({value, id: id++})));
      state = state.merge({
        win: value === WIN_SCORE || null,
        score: state.get("score") + value
      });
    }
  });

  return state.merge({
    cells, result, grid
  });
}

/**
 * Default Reducer
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_TILE:
      return newTile(state, action.cell);

    case actionTypes.MOVE_TILES:
      return moveInDirection(state, action.direction);

    case actionTypes.ACTUALIZE:
      return actualize(state);

    case actionTypes.MERGE_TILES:
      return mergeTiles(state);

    case actionTypes.INIT_GAME:
      store(false);
      state = defaultState;
      action.cells.map(cell => state = newTile(state, cell));
      return state;

    case actionTypes.GAME_OVER:
      state = state.set("win", false);
      return state;

    case actionTypes.SAVE_GAME:
      store("game", state.toJS());
      return state;

    case actionTypes.RESET_RESULT:
      state = state.set("result", START_SCORE);
      return state;

    default:
      return state;
  }
};
