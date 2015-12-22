/**
 * Generate action types in the form of:
 *
 *   {ACTION: "ACTION"}
 *
 * Add your own pre/post action types in the loop if needed.
 *
 * - Example:
 *
 *     actionMap[`BEFORE_${actions[i]}`] = null;
 *     actionMap[`AFTER_${actions[i]}`] = null;
 */
export function generateActions(actions) {
  const actionMap = {};

  for (const i in actions) {
    if ({}.hasOwnProperty.call(actions, i)) {
      actionMap[actions[i]] = actions[i];
    }
  }

  return actionMap;
}
