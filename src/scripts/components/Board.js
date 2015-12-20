import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Grid, Tile, Overlay} from "./";
import {List, Map} from "immutable";
import {DIRECTIONS, UP, LEFT, DOWN, RIGHT} from "../constants";
import _ from "lodash";

const startTiles = 2;
const initialTouch = {x: 0, y: 0};

function getTouches(touches) {
  return {
    x: touches[0].clientX,
    y: touches[0].clientY
  };
}

@connect(state => {
  return {
    board: state.board,
    dimensions: state.board.get("dimensions"),
    isActual: state.board.get("isActual"),
    win: state.board.get("win"),
    fromSaved: state.board.get("fromSaved"),
    moved: state.board.get("moved")
  };
})
export default class Board extends Component {
  static propTypes = {
    board: PropTypes.instanceOf(Map).isRequired,
    dimensions: PropTypes.instanceOf(List).isRequired,
    isActual: PropTypes.bool.isRequired,
    win: PropTypes.bool,
    fromSaved: PropTypes.bool.isRequired,
    moved: PropTypes.bool.isRequired
  }

  static contextTypes = {
    actions: PropTypes.object.isRequired
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
      _.times(startTiles, () => {
        this.context.actions.newTile();
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {isActual, moved} = this.props;

    if (!isActual && prevProps.isActual !== isActual) {
      setTimeout(() => {
        this.context.actions.actualize();
        this.called = false;
      }, 50);
    } else {
      if (moved) {
        this.called = true;
        this.queue.shift();
        this.resolve();
        this.context.actions.setMoved(false);
      }
    }
  }

  render() {
    const {board, win, dimensions, fromSaved} = this.props;

    const tiles = board.get("grid").flatten(2);
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
        <Grid size={dimensions.toJS()} />
      </wrapper>
    );
  }

  _moveTiles(direction) {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.context.actions.moveTiles(direction);
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
    this.context.actions.restartGame();
  }
}
