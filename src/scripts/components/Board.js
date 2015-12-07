import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Grid, Tile, Overlay} from "./";
import _ from "lodash";

const startTiles = 2;

@connect(state => {
  return {
    board: state.board,
    size: state.board.get("size"),
    isActual: state.board.get("isActual"),
    win: state.board.get("win")
  };
})
export default class Board extends Component {
  static propTypes = {
    size: PropTypes.array.isRequired,
    isActual: PropTypes.bool.isRequired,
    win: PropTypes.bool
  }

  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  componentDidMount() {
    const tiles = this.refs.tiles;
    tiles.addEventListener("transitionend", this.onTransitionEnd, false);

    document.addEventListener("keyup", (e) => {
      this.context.actions.moveTiles(e.keyCode);
    });

    _.times(startTiles, () => {
      this.context.actions.newTile();
    });
  }

  called: false

  componentDidUpdate(prevProps) {
    if (!this.props.isActual && prevProps.isActual !== this.props.isActual) {
      setTimeout(() => {
        this.context.actions.actualize();
        this.called = false;

        // TODO
        //
        // Emit on updated tiles?!
        // Wait for all tiles to be rendered before actualizing them
        // or their initial position will be the actualized one
        // WORKING WITH {50] ?
      }, 50);
    }
  }

  onTransitionEnd = (e) => {
    // Don't execute on first transition but on last!!
    // TODO - wait for all transitions to end before creating new one
    if (e.propertyName === "transform") return;
    if (!this.called) {
      this.context.actions.mergeTiles();
      this.context.actions.newTile();
      this.called = true;
    }
  }

  render() {
    const {win, size} = this.props;

    const tiles = this.props.board.get("grid").flatten(2);
    const tileViews = tiles.map(tile => {
      return <Tile
               key={tile.get("id")}
               {...tile.toJS()}
             />;
    });

    const hasEnded = (win !== null);
    if (hasEnded) document.removeEventListener("keyup");

    return (
      <wrapper>
        {hasEnded && <Overlay win={win} />}
        <container ref="tiles" id="tiles">
          {tileViews}
        </container>
        <Grid size={size} />
      </wrapper>
    );
  }
}
