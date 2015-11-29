import keyMirror from "keymirror";

export function generateActions(actions) {
  const actionMap = {};

  for (const i in actions) {
    actionMap[actions[i]] = null;
  }

  return keyMirror(actionMap);
}
