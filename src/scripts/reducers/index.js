import {combineReducers} from "redux";
import game from "./Game";
import board from "./Board";

/**
 * Import and combine reducers.
 */
export default combineReducers({
  game,
  board
});
