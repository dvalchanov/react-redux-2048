export default ({win = false}) => {
  const message = win ?
    "You won. Congratulations!" :
    "Game over. Try again.";

  return (
    <div id="overlay">
      <h2>{message}</h2>
    </div>
  );
};
