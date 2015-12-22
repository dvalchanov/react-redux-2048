import restartImage from "img/restart.svg";

export default ({win = false, onRestart}) => {
  const message = win ?
    "You won. Congratulations!" :
    "Game over.";

  const cx = win ? "win" : "lose";

  return (
    <div id="overlay" className={cx}>
      <h2>{message}</h2>
      <img src={restartImage} className="restart" onClick={onRestart}></img>
    </div>
  );
};
