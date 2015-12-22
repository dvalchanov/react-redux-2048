import {Map, List} from "immutable";
import {randomNumber} from "./utils/math";

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
 * Loop through each cell in the provided grid.
 *
 * @param {Object} grid
 * @param {Function} cb
 */
export function forEachCell(grid, cb) {
  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      cb({cell, x, y});
    });
  });
}

/**
 * Get a random cell from the list of empty cells.
 *
 * @param {Object} state
 * @returns {Object}
 */
export function randomCell(cells) {
  const max = cells.size - 1;
  return randomNumber(0, max);
}
