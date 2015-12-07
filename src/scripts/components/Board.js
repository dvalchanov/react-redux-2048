import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Grid, Tile} from "./";
import _ from "lodash";

const startTiles = 2;

@connect(state => {
  return {
    board: state.board,
    size: state.board.get("size"),
    isActual: state.board.get("isActual")
  };
})
export default class Board extends Component {
  static propTypes = {
    size: PropTypes.array.isRequired
  }

  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  componentDidMount() {
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
        // TODO - check
        // Wait for all tiles to be rendered before actualizing them
        // or their initial position will be the actualized one
        // WORKING WITH {1] ?
      }, 1);
    }
  }

  onTransitionEnd = (e) => {
    // TODO - wait for all transitions to end before creating new one
    if (e.propertyName === "transform") return;
    if (!this.called) {
      this.context.actions.mergeTiles();
      this.context.actions.newTile();
      this.called = true;
    }
  }


  render() {
    const {size} = this.props;

    const tiles = this.props.board.get("grid").flatten(2);
    const tileViews = tiles.map(tile => {
      return <Tile
               key={tile.get("id")}
               onTransitionEnd={this.onTransitionEnd}
               {...tile.toJS()}
             />;
    });

    return (
      <wrapper>
        <container id="tiles">
          {tileViews}
        </container>
        <Grid size={size} />
      </wrapper>
    );
  }
}
