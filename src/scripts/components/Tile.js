import {Component, PropTypes} from "react";
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
    // Sometimes transition doesn't happen!?!?
    tile.addEventListener("transitionend", this.props.onTransitionEnd, false);
  }

  render() {
    const {x, y, value} = this.props;

    // UPDATED too many times

    // Queue ?
    // Transitions should happen one after another
    const styles = {
      top: 10 + (60 * x),
      left: 10 + (60 * y)
    };

    return (
      <ReactCSSTransitionGroup
        transitionName={value === 2 ? "tile" : "merged"}
        transitionAppear={true}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        transitionAppearTimeout={1000} >
        <div style={styles} ref="tile" className="tile tile-2">{value}</div>
      </ReactCSSTransitionGroup>
    );
  }
}
