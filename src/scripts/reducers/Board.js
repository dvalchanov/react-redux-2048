import {Map, List, Range, fromJS} from "immutable";
import actionTypes from "../actions/actionTypes";
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

const initialState = Map({
  forSlide: false,
  size: [4, 4],
  empty: fromJS(generateCells(4, 4)),
  tiles: List(),
  grid: generateGrid(4, 4)
});

//[
  //[[ ], [ ], [y2], [ ]],
  //[[z], [ ], [y1], [ ]],
  //[[ ], [x], [ ], [ ]],
  //[[ ], [z], [ ], [ ]]
//]
//
//Click Down
//Move x (stays on the same place)
//Move z
//Move y1 on the first available position
//Move y2 on the first available position (y1 position should be available)
//Check if there are two tiles on the same position and merge them

// Up    - up -> down
// Down  - down -> up
// Left  - left -> right
// Right - right -> left

// Check what is empty after each round!!
// [{x: 1, y: 1}, {x: 3, y: 1}]


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTile(state) {
  const max = state.get("empty").size - 1;
  const cell = getRandomNumber(0, max);

  if (state.get("empty").size === 0) return state;

  let tile = state.getIn(["empty", cell]);
  const {x, y} = tile.toJS();
  tile = tile.set("value", 2);
  state = state.updateIn(["grid", x, y], arr => arr.push(tile));
  const empty = state.get("empty").splice(cell, 1);

  return state.merge({empty});
}

//function slide() {
//}

function findAvailable(state, tile) {
  let current;
  const vector = {x: -1, y: 0};
  let grid = state.get("grid");

  for (const i in vector) {
    if ({}.hasOwnProperty.call(vector, i)) {
      if (vector[i] !== 0) {
        current = i;
      }
    }
  }

  const from = tile.get(current);
  const to = vector[current] === 1 ? 0 : 3;
  let found = false;

  Range(to, from).forEach(index => {
    const path = [index, tile.get("y")];
    const cell = grid.getIn(path);

    if (!cell.size && !found) {
      state = state.set("forSlide", true);
      grid = grid.updateIn(path, arr => arr.push(tile));
      grid = grid.updateIn([tile.get("x"), tile.get("y")], arr => {
        return arr.pop();
      });
      found = true;
    }
  });

  return state.set("grid", grid);
}

function slideTile(state, tile) {
  state = findAvailable(state, tile);

  return state;
}

function slideTiles(state) {
  let tiles = state.get("grid").flatten(2);

  // or y
  tiles = tiles.sortBy(t => t.get("x"));

  // Reverse if needed

  tiles.forEach((tile) => {
    state = slideTile(state, tile);
  });

  return state;
}

function actualize(state) {
  let grid = state.get("grid");

  for (let row = 0; row <= 3; row++) {
    for (let column = 0; column <= 3; column++) {
      const tile = grid.getIn([row, column]);

      if (tile.size) {
        if (tile.get("x") !== row && tile.get("y") !== column) {
          grid = grid.updateIn([row, column, 0], t => {
            return t.merge({x: row, y: column});
          });
        }
      }
    }
  }

  return state.set("grid", grid);
}


export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_TILE:
      return getTile(state);

    case actionTypes.SLIDE_TILES:
      state = slideTiles(state);
      return state;

    case actionTypes.ACTUALIZE:
      state = actualize(state);
      return state;

    case actionTypes.MERGE_TILES:
      return state;

    default:
      return state;
  }
};
