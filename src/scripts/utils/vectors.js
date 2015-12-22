import {VECTORS} from "js/constants";

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
export function getCurrent(direction) {
  let axis;
  const axises = getVector(direction);

  for (const current in axises) {
    if ({}.hasOwnProperty.call(axises, current)) {
      if (axises[current] !== 0) {
        axis = current;
      }
    }
  }

  return {
    axis,
    value: axises[axis]
  };
}
