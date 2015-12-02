import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Tile} from "./";
import _ from "lodash";

// Smart component (container?)
@connect(state => {
  return {
    board: state.board,
    size: state.board.get("size")
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
    this.context.actions.initTiles();

    setTimeout(() => {
      this.context.actions.slideTiles();

      //setInterval(() => {
        //this.context.actions.newTile();
      //}, 1000);
    }, 1000);
  }

  render() {
    const {size} = this.props;

    const cells = _.range(_.reduce(size, x => x * x));
    // In component
    // Should return value (position, coordinates?)
    const cellViews = _.map(cells, index => {
      return <column key={index} />;
    });

    const realTiles = this.props.board.get("tiles");
    const againTiles = realTiles.map((tile, index) => {
      return <Tile key={index} {...tile.toJS()} />;
    });

    return (
      <wrapper>
        <container id="tiles">
          {againTiles}
        </container>
        <container id="board">
          {cellViews}
        </container>
      </wrapper>
    );
  }
}
