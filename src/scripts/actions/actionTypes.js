import {generateActions} from "../utils/actions";

const actions = [
  "INIT_TILES",
  "NEW_TILE",
  "SLIDE_TILES",
  "MERGE_TILES"
];

export default generateActions(actions);
