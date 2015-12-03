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
  //grid: generateGrid(4, 4)
  grid: fromJS([
    [[], [], [], []],
    [[], [], [], [{x: 1, y: 3, value: 2, id: 1}]],
    [[], [], [{x: 2, y: 2, value: 2, id: 0}], []],
    [[], [], [], []]
  ])
});

let id = 0;

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
  tile = tile.set("id", id);
  id += 1;
  state = state.updateIn(["grid", x, y], arr => arr.push(tile));
  const empty = state.get("empty").splice(cell, 1);

  return state.merge({empty});
}

const dir = 0;

function getDirection(n) {
  const directions = [
    {x: 1, y: 0},  // down -> top
    {x: 0, y: 1},  // right -> left
    {x: -1, y: 0}, // top -> down
    {x: 0, y: -1}  // left -> right
  ];

  return directions[n] || directions[0];
}

function slideTile(state, tile) {
  let current;
  const direction = getDirection(dir);
  let grid = state.get("grid");

  for (const i in direction) {
    if ({}.hasOwnProperty.call(direction, i)) {
      if (direction[i] !== 0) {
        current = i;
      }
    }
  }

  const from = tile.get(current);
  const to = direction[current] === 1 ? 0 : 3;
  let found = false;

  Range(to, from).forEach(index => {
    if (!found) {
      const path = (
        current === "x" ?
        [index, tile.get("y")] :
        [tile.get("x"), index]
      );
      const cell = grid.getIn(path);

      if (cell.size && cell.getIn([0, "value"]) !== tile.get("value")) return;

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

function slideTiles(state) {
  let tiles = state.get("grid").flatten(2);

  // fix
  if (dir === 1 || dir === 3) {
    tiles = tiles.sortBy(t => t.get("y"));
  } else {
    tiles = tiles.sortBy(t => t.get("x"));
  }

  console.log(tiles.toJS());
  tiles.forEach((tile) => {
    state = slideTile(state, tile);
  });

  return state;
}

function actualize(state) {
  let grid = state.get("grid");

  for (let row = 0; row <= 3; row++) {
    for (let column = 0; column <= 3; column++) {
      const tiles = grid.getIn([row, column]);

      if (tiles.size) {
        tiles.forEach((tile, index) => {
          console.log(tile.get("id"), [row, column]);
          if (tile.get("x") !== row || tile.get("y") !== column) {
            grid = grid.updateIn([row, column, index], t => {
              return t.merge({x: row, y: column});
            });
          }
        });
      }
    }
  }

  return state.set("grid", grid);
}


export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_TILE:
      return state;
      //return getTile(state);

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
