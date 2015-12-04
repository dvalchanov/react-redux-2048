import {Component, PropTypes} from "react";
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

    const styles = {
      top: 10 + (60 * x),
      left: 10 + (60 * y)
    };


    //console.log(styles, value);

    return (
      <ReactCSSTransitionGroup
        transitionName="tile"
        transitionAppear={true}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        transitionAppearTimeout={300} >
        <div style={styles} ref="tile" className="tile tile-2">{value}</div>
      </ReactCSSTransitionGroup>
    );
  }
}
