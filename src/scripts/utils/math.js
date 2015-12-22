/**
 * Get a random number in a certain range.
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Set lucky chance to pick a x-tile.
 *
 * @param {Number} percentage
 * @returns {Function}
 */
function setLucky(percentage) {
  const min = 1;
  const max = Math.round(100 / percentage);
  const luckyNumber = randomNumber(min, max);

  return () => {
    if (randomNumber(min, max) === luckyNumber) return true;
    return false;
  };
}

/**
 * Export a new function telling if a certain number is the lucky one.
 */
export const isLucky = setLucky(1);
