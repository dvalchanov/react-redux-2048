import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Tile} from "./";
import _ from "lodash";

const startTiles = 2;

@connect(state => {
  return {
    board: state.board,
    size: state.board.get("size"),
    forSlide: state.board.get("forSlide")
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
    _.times(startTiles, () => {
      this.context.actions.newTile();
    });

    setTimeout(() => {
      this.context.actions.slideTiles();

      //setInterval(() => {
        //this.context.actions.newTile();
      //}, 1000);
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forSlide && nextProps.forSlide !== this.props.forSlide) {
      this.context.actions.actualize();
    }
  }

  render() {
    const {size} = this.props;

    // In component
    // Should return value (position, coordinates?)
    // Should render only once
    const cells = _.range(_.reduce(size, x => x * x));
    const cellViews = _.map(cells, index => {
      return <column key={index} />;
    });

    const tiles = this.props.board.get("grid").flatten(2);
    const tileViews = tiles.map((tile, index) => {
      return <Tile key={index} {...tile.toJS()} />;
    });

    return (
      <wrapper>
        <container id="tiles">
          {tileViews}
        </container>
        <container id="board">
          {cellViews}
        </container>
      </wrapper>
    );
  }
}
