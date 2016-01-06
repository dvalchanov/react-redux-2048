import {generateActions} from "js/utils/actions";

/**
 * Actions to be generated.
 */
const actions = [
  "NEW_TILE",
  "MOVE_TILES",
  "ACTUALIZE",
  "MERGE_TILES",
  "INIT_GAME",
  "GAME_OVER",
  "SAVE_GAME",
  "RESET_RESULT"
];

export default generateActions(actions);
