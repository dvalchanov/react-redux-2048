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

  transition: ".1s ease-in-out"

  //componentWillReceiveProps(nextProps) {
    //const dX = Math.abs(nextProps.x - this.props.x);
    //const dY = Math.abs(nextProps.y - this.props.y);

    //if (dX) {
      //this.transition = `.${dX}s ease-in-out`;
    //}

    //if (dY) {
      //this.transition = `.${dY}s ease-in-out`;
    //}
  //}

  componentDidMount() {
    const tile = this.refs.tile;
    // Transition doesn't happen on DOWN !?!?
    tile.addEventListener("transitionend", this.props.onTransitionEnd, false);
  }

  render() {
    const {x, y, value} = this.props;

    const cx = classNames(
      "tile",
      `tile-${value}`,
      `cell-${x}-${y}`
    );

    // Transitions should happen one after another - queue?

    return (
      <ReactCSSTransitionGroup
        transitionName={value === 2 ? "tile" : "merged"}
        transitionAppear={true}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        transitionAppearTimeout={1000} >
        <div ref="tile" className={cx}>{value}</div>
      </ReactCSSTransitionGroup>
    );
  }
}
