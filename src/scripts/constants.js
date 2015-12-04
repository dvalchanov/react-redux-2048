export const UP = 0;
export const LEFT = 1;
export const DOWN = 2;
export const RIGHT = 3;

export const DIRECTIONS = [];
DIRECTIONS[UP] = {x: 1, y: 0};
DIRECTIONS[LEFT] = {x: 0, y: 1};
DIRECTIONS[DOWN] = {x: -1, y: 0};
DIRECTIONS[RIGHT] = {x: 0, y: -1};

export const KEYCODES = {
  38: UP,
  37: LEFT,
  40: DOWN,
  39: RIGHT
};
