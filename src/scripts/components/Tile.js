import {Component, PropTypes} from "react";
import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class Tile extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onTransitionEnd: PropTypes.func.isRequired
  }

  componentDidMount() {
    const tile = this.refs.tile;
    tile.addEventListener("transitionend", this.props.onTransitionEnd, false);
  }

  render() {
    const {x, y, value} = this.props;

    const cx = classNames(
      "tile",
      `tile-${value}`,
      `cell-${x}-${y}`
    );

    const isMerged = (value !== 2);

    return (
      <ReactCSSTransitionGroup
        transitionName={isMerged ? "merged" : "tile"}
        transitionAppear={true}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        transitionAppearTimeout={0} >
        <div ref="tile" className={cx}>
          {value}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
