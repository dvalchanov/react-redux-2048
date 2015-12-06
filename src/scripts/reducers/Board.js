import {Map, List, Range, fromJS} from "immutable";
import actionTypes from "../actions/actionTypes";
import {KEYCODES, DIRECTIONS, INITIAL} from "../constants";
import _ from "lodash";

function generateCells(width, height) {
  const cells = [];

  _.times(width, x => {
    _.times(height, y => {
      cells.push({x, y});
    });
  });

  return cells;
}

function generateGrid(width, height) {
  let cells = List();

  _.times(width, x => {
    cells = cells.set(x, List());
    _.times(height, y => {
      cells = cells.setIn([x, y], List());
    });
  });

  return cells;
}

// TODO - fix (4, 4);
const initialState = Map({
  forSlide: false,
  size: [4, 4],
  cells: fromJS(generateCells(4, 4)),
  grid: generateGrid(4, 4)
});

/**
 * New Random Tile
 *
 * newTile.js util ?
 */
let id = 0;

/**
 * Get a random number in a certain range.
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


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
function addTile(state, tile) {
  return state.updateIn(["grid", tile.get("x"), tile.get("y")], cell => {
    return cell.push(tile.merge({
      id: id++,
      value: INITIAL
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

  state = addTile(state, tile);

  return state.set({
    cells: state.get("cells").splice(cell, 1)
  });
}


/**
 * Slide
 */
function getDirection(n) {
  return DIRECTIONS[n];
}

function getCurrent(direction) {
  let axis;
  const directions = getDirection(direction);

  for (const i in directions) {
    if ({}.hasOwnProperty.call(directions, i)) {
      if (directions[i] !== 0) {
        axis = i;
      }
    }
  }

  return {
    axis: axis,
    value: directions[axis]
  };
}

// TODO - fix
function slideTile(state, tile, direction) {
  const {axis, value} = getCurrent(direction);
  const from = tile.get(axis);
  const to = value === 1 ? 0 : 3;

  let found;

  Range(to, from).forEach(index => {
    const path = (
      axis === "x" ?
      ["grid", index, tile.get("y")] :
      ["grid", tile.get("x"), index]
    );

    const cell = state.getIn(path);

    if (cell.size && cell.getIn([0, "value"]) !== tile.get("value")) {
      found = null;
      return;
    }

    if (cell.size > 1) {
      found = null;
      return;
    }

    if (!found) found = path;
  });

  if (found) {
    state = state.set("forSlide", true);
    state = state.updateIn(found, arr => arr.push(tile));
    state = state.updateIn(["grid", tile.get("x"), tile.get("y")], arr => {
      return arr.pop();
    });
  }

  return state;
}

function sortTiles(tiles, direction) {
  const {axis, value} = getCurrent(direction);
  tiles = tiles.sortBy(t => t.get(axis));
  if (value < 0) tiles = tiles.reverse();
  return tiles;
}

function slideTiles(state, direction) {
  let tiles = state.get("grid").flatten(2);
  tiles = sortTiles(tiles, direction);
  tiles.forEach((tile) => {
    state = slideTile(state, tile, direction);
  });

  return state;
}

function actualize(state) {
  let grid = state.get("grid");

  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell.size) {
        cell.forEach((tile, index) => {
          if (tile.get("x") !== x || tile.get("y") !== y) {
            grid = grid.updateIn([x, y, index], t => {
              return t.merge({x, y});
            });
          }
        });
      }
    });
  });

  state = state.set("forSlide", false);

  return state.set("grid", grid);
}

function mergeTiles(state) {
  let grid = state.get("grid");

  const cells = [];

  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (!cell.size) {
        cells.push({x, y});
      }

      if (cell.size > 1) {
        const newValue = cell.reduce((t1, t2) => {
          return t1.get("value") + t2.get("value");
        });

        const newTile = Map({
          x: cell.getIn([0, "x"]),
          y: cell.getIn([0, "y"]),
          value: newValue,
          id: id
        });

        id += 1;

        grid = grid.setIn([x, y], List.of(newTile));
      }
    });
  });

  state = state.set("grid", grid);
  return state.set("cells", fromJS(cells));
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_TILE:
      return newTile(state);

    case actionTypes.SLIDE_TILES:
      const direction = KEYCODES[action.keyCode];
      if (typeof direction === "undefined") return state;
      return slideTiles(state, direction);

    case actionTypes.ACTUALIZE:
      state = actualize(state);
      return state;

    case actionTypes.MERGE_TILES:
      state = mergeTiles(state);
      return state;

    default:
      return state;
  }
};
