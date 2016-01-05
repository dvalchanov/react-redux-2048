/**
 * Directions.
 */
export const UP = 0;
export const LEFT = 1;
export const DOWN = 2;
export const RIGHT = 3;

/**
 * Direction vectors in the form of `from -> to`.
 * If the value is 0, there is no movement on that axis.
 */
export const VECTORS = [];
VECTORS[UP] = {x: 1, y: 0};
VECTORS[LEFT] = {x: 0, y: 1};
VECTORS[DOWN] = {x: -1, y: 0};
VECTORS[RIGHT] = {x: 0, y: -1};

/**
 * Key codes for the 4 arrows directions.
 */
export const DIRECTIONS = {
  38: UP,
  37: LEFT,
  40: DOWN,
  39: RIGHT
};

/**
 * Game specific values.
 */
export const INITIAL = 2;
export const SIZE = 4;
export const STARTING_TILES = 2;
export const START_SCORE = 0;
export const WIN_SCORE = 2048;
