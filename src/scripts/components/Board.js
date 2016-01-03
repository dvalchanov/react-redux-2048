import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Map} from "immutable";
import {Grid, Tile, Overlay} from "./";
import {DIRECTIONS, UP, LEFT, DOWN, RIGHT, SIZE} from "js/constants";

/**
 * Default touch values.
 */
const initialTouch = {x: 0, y: 0};

/**
 * Get the according touches for `x` and `y` axis.
 *
 * @param {Object} touches
 * @returns {Object}
 */
function getTouches(touches) {
  return {
    x: touches[0].clientX,
    y: touches[0].clientY
  };
}

/**
 * Connect this component with its according reducer and needed values.
 */
@connect(state => {
  const game = state.game;

  return {
    game,
    isActual: game.get("isActual"),
    win: game.get("win"),
    fromSaved: game.get("fromSaved")
  };
})
export default class Board extends Component {

  /**
   * Expected properties object types.
   */
  static propTypes = {
    game: PropTypes.instanceOf(Map).isRequired,
    isActual: PropTypes.bool.isRequired,
    win: PropTypes.bool,
    fromSaved: PropTypes.bool.isRequired,
    handleNewGame: PropTypes.func.isRequired
  }

  /**
   * Expected context object types.
   */
  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  /**
   * Initial component`s state.
   */
  state = {
    moved: false
  }

  /**
   * Current touch `x` and `y` values.
   */
  touch: initialTouch

  /**
   * Used to initiate the merging of tiles only once.
   * Set to `true` after that and returned to `false` on the next turn.
   */
  called: false

  /**
   * Queue of actions to be executed. Needed in case a new event is initiated
   * earlier than the previous one has completed.
   */
  queue = []

  /**
   * Called only once.
   *
   * Initialize important event listeners and the game if
   * there is a saved state.
   */
  componentDidMount() {
    const {tiles, board} = this.refs;

    document.addEventListener("keyup", this._handleKeyUp, false);
    tiles.addEventListener("transitionend", this._handleTransitionEnd, false);
    board.addEventListener("touchstart", this._handleTouchStart, false);
    board.addEventListener("touchmove", this._disableScroll, false);
    board.addEventListener("touchend", this._handleTouchEnd, false);

    if (!this.props.fromSaved) {
      this.context.actions.initGame();
    }
  }

  /**
   * Called after each time the component is updated.
   *
   * Check if there is some change in the tiles positions that needs to be actualized,
   * or restart the actions queue if there is not change after the move.
   */
  componentDidUpdate(prevProps) {
    const {isActual} = this.props;

    if (!isActual && prevProps.isActual !== isActual) {
      setTimeout(() => {
        this.context.actions.actualize();
        this.setState({moved: false});
        this.called = false;
      }, 50);
    } else {
      if (this.state.moved) {
        this._resolve();
      }
    }
  }

  /**
   * Render the provided structure.
   */
  render() {
    const {game, win, fromSaved, handleNewGame} = this.props;

    const tiles = game.get("grid").flatten(2);
    const tileViews = tiles.map(tile => {
      return <Tile
               fromSaved={fromSaved}
               key={tile.get("id")}
               {...tile.toJS()}
             />;
    });

    const hasEnded = (win !== null);
    if (hasEnded) document.removeEventListener("keyup");

    return (
      <wrapper ref="board">
        {hasEnded && <Overlay onNewGame={handleNewGame} win={win} />}
        <container ref="tiles" id="tiles">
          {tileViews}
        </container>
        <Grid size={SIZE} />
      </wrapper>
    );
  }

  /**
   * Check the key code and execute the according action if it's an arrow key,
   * meaning if it is from the given directions.
   *
   * @param {Object} e
   */
  _handleKeyUp = (e) => {
    const direction = DIRECTIONS[e.keyCode];

    if (typeof direction !== "undefined") {
      this._prepare(direction);
    }
  }

  /**
   * Disable the scrolling if the finger is over the board.
   *
   * @param {Object} e
   */
  _disableScroll = (e) => {
    e.preventDefault();
  }

  /**
   * Save the initial touch event.
   *
   * @param {Object} e
   */
  _handleTouchStart = (e) => {
    this.touch = getTouches(e.touches);
  }

  /**
   * Calculate the difference between the start and end touches, check what
   * the direction is and execute the according action.
   *
   * @param {Object} e
   */
  _handleTouchEnd = (e) => {
    if (!this.touch.x || !this.touch.y) return;

    const {x, y} = getTouches(e.changedTouches);

    const dX = this.touch.x - x;
    const dY = this.touch.y - y;

    if (Math.abs(dX) > Math.abs(dY)) {
      if (dX > 0) this._prepare(LEFT);
      else this._prepare(RIGHT);
    } else {
      if (dY > 0) this._prepare(UP);
      else this._prepare(DOWN);
    }

    this.touch = initialTouch;
    this.refs.board.removeEventListener("touchmove");
  }

  /**
   * Merge the tiles and create a new one after the tiles
   * are moved to their new positions.
   *
   * @param {Object} e
   */
  _handleTransitionEnd = (e) => {
    if (["top", "left"].indexOf(e.propertyName) === -1) return;

    if (!this.called) {
      this.context.actions.mergeTiles();
      this.context.actions.newTile();

      this._resolve();
    }
  }

  /**
   * Move the tiles and set a new Promise that needs to be completed after the merging.
   * If not completed the next action in the queue won't be executed.
   *
   * @param {Number} direction
   * @returns {Promise}
   */
  _moveTiles(direction) {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.context.actions.moveTiles(direction);
      this.setState({moved: true});
    });
  }

  /**
   * Prepare certain direction to be executed.
   *
   * @param {Number} direction
   */
  _prepare = (direction) => {
    this.queue.push(direction);
    this._execute(true);
  }

  /**
   * Resolve the last executed direction.
   */
  _resolve = () => {
    this.queue.shift();
    this.resolve();
    this.called = true;
  }

  /**
   * Execute the actions in the queue one after another. Change the function after
   * the first execution, since the logic is changed after that or set the initial
   * function if there are no more actions to be executed.
   */
  _execute = async function initialExecute() {
    if (this.queue.length <= 1) {
      await this._moveTiles(this.queue[0]);

      if (this.queue.length) {
        this._execute();
      }
    } else {
      this._execute = async (initial) => {
        if (initial) return;

        if (this.queue.length) {
          await this._moveTiles(this.queue[0]);
          this._execute();
        } else {
          this._execute = initialExecute;
        }
      };
    }
  }
}
