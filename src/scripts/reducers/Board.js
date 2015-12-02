import {Map, List, fromJS} from "immutable";
import actionTypes from "../actions/actionTypes";
import _ from "lodash";

function generateCells(width, height) {
  const cells = [];

  _.times(width, x => {
    _.times(height, y => {
      cells.push({
        x,
        y,
        value: 0
      });
    });
  });

  return cells;
}

const initialState = Map({
  size: [4, 4],
  empty: fromJS(generateCells(4, 4)),
  tiles: List()
});

//[
  //[[ ], [ ], [y2], [ ]],
  //[[z], [ ], [y1], [ ]],
  //[[ ], [x], [ ], [ ]],
  //[[ ], [ ], [ ], [ ]]
//]
//
//Move x
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

  console.log(state.get("empty").size, cell);

  if (state.get("empty").size === 0) {
    return state;
  }

  let tile = state.getIn(["empty", cell]);
  tile = tile.set("value", 2);
  const tiles = state.get("tiles").push(tile);
  const empty = state.get("empty").splice(cell, 1);

  return state.merge({tiles, empty});
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_TILES:
      state = getTile(state);
      state = getTile(state);
      return state;

    case actionTypes.NEW_TILE:
      return getTile(state);

    case actionTypes.SLIDE_TILES:
      state.get("tiles").forEach((tile) => {
        console.log(tile);
      });
      return state.setIn(["tiles", 0, "x"], 3);

    case actionTypes.MERGE_TILES:
      return state;

    default:
      return state;
  }
};
