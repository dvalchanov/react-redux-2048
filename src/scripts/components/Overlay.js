import restartImage from "img/restart.svg";

/**
 * Stateles Overlay component, composed of a simple function.
 *
 * @param {Object}
 *  - `win` - has the player won the game
 *  - `onRestart` - callback to restart the game
 */
export default ({onNewGame, win = false}) => {
  const message = win ?
    "You won. Congratulations!" :
    "Game over.";

  const cx = win ? "win" : "lose";

  return (
    <div id="overlay" className={cx}>
      <h2>{message}</h2>
      <img src={restartImage} className="restart" onClick={onNewGame}></img>
    </div>
  );
};
