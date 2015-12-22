import {generateActions} from "../utils/actions";

const actions = [
  "NEW_TILE",
  "MOVE_TILES",
  "ACTUALIZE",
  "MERGE_TILES",
  "INIT_GAME",
  "RESTART_GAME",
  "GAME_OVER",
  "SAVE_GAME",
  "MERGED",
  "RESET_RESULT",
  "SET_MOVED"
];

export default generateActions(actions);
