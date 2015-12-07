import {Component, PropTypes} from "react";
import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class Tile extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired
  }

  render() {
    const {x, y, value, id} = this.props;

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
        <div className={cx} key={id} ref="tile">
          {value}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
