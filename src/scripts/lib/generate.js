import {Map, List} from "immutable";

/**
 * Generate a list of the available empty cells.
 *
 * @param {Number} height
 * @param {Number} width
 * @returns {Object}
 */
export function generateCells(height, width) {
  let cells = List();

  _.times(height, x => {
    _.times(width, y => {
      cells = cells.push(Map({x, y}));
    });
  });

  return cells;
}

/**
 * Generate a grid for of empty cells to be filled with tiles.
 *
 * @param {Number} height
 * @param {Number} width
 * @returns {Object}
 */
export function generateGrid(height, width) {
  let cells = List();

  _.times(height, x => {
    cells = cells.set(x, List());
    _.times(width, y => {
      cells = cells.setIn([x, y], List());
    });
  });

  return cells;
}
