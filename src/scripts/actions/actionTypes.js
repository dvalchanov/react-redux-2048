import {generateActions} from "../utils/actions";

const actions = [
  "NEW_TILE",
  "MOVE_TILES",
  "ACTUALIZE",
  "MERGE_TILES"
];

export default generateActions(actions);
