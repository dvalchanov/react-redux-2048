export const UP = 0;
export const LEFT = 1;
export const DOWN = 2;
export const RIGHT = 3;

export const VECTORS = [];
VECTORS[UP] = {x: 1, y: 0};
VECTORS[LEFT] = {x: 0, y: 1};
VECTORS[DOWN] = {x: -1, y: 0};
VECTORS[RIGHT] = {x: 0, y: -1};

export const DIRECTIONS = {
  38: UP,
  37: LEFT,
  40: DOWN,
  39: RIGHT
};

export const INITIAL = 2;
