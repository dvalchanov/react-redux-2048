import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Map} from "immutable";
import {Grid, Tile, Overlay} from "./";
import {DIRECTIONS, UP, LEFT, DOWN, RIGHT, SIZE} from "js/constants";

const initialTouch = {x: 0, y: 0};

function getTouches(touches) {
  return {
    x: touches[0].clientX,
    y: touches[0].clientY
  };
}

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
  static propTypes = {
    game: PropTypes.instanceOf(Map).isRequired,
    isActual: PropTypes.bool.isRequired,
    win: PropTypes.bool,
    fromSaved: PropTypes.bool.isRequired
  }

  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  state = {
    moved: false
  }

  touch: initialTouch
  called: false
  queue = []

  componentDidMount() {
    const {tiles, board} = this.refs;

    document.addEventListener("keyup", this._handleKeyUp, false);
    tiles.addEventListener("transitionend", this._handleTransitionEnd, false);
    board.addEventListener("touchstart", this._handleTouchStart, false);
    board.addEventListener("touchend", this._handleTouchEnd, false);

    if (!this.props.fromSaved) {
      this.context.actions.initGame();
    }
  }

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
        this.queue.shift();
        this.resolve();
        this.called = true;
      }
    }
  }

  render() {
    const {game, win, fromSaved} = this.props;

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
        {hasEnded && <Overlay win={win} onRestart={this._handleRestart} />}
        <container ref="tiles" id="tiles">
          {tileViews}
        </container>
        <Grid size={SIZE} />
      </wrapper>
    );
  }

  _moveTiles(direction) {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.context.actions.moveTiles(direction);
      this.setState({moved: true});
    });
  }

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

  _handleKeyUp = (e) => {
    const direction = DIRECTIONS[e.keyCode];

    if (typeof direction !== "undefined") {
      this.queue.push(direction);
      this._execute(true);
    }
  }

  _handleTouchStart = (e) => {
    this.touch = getTouches(e.touches);
  }

  // in util?
  _handleTouchEnd = (e) => {
    if (!this.touch.x || !this.touch.y) return;

    const {x, y} = this.getTouches(e.changedTouches);

    const dX = this.touch.x - x;
    const dY = this.touch.y - y;

    if (Math.abs(dX) > Math.abs(dY)) {
      if (dX > 0) this.queue.push(LEFT);
      else this.queue.push(RIGHT);
    } else {
      if (dY > 0) this.queue.push(UP);
      else this.queue.push(DOWN);
    }

    this._execute(true);
    this.touch = initialTouch;
  }

  _handleTransitionEnd = (e) => {
    // Don't _execute on first transition end but on last!!
    if (e.propertyName === "transform") return;
    if (!this.called) {
      this.context.actions.mergeTiles();
      this.context.actions.newTile();
      this.called = true;

      this.queue.shift();
      this.resolve();
    }
  }

  _handleRestart = () => {
    this.context.actions.initGame();
  }
}
