import {Component, PropTypes} from "react";
import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class Tile extends Component {

  /**
   * Expected properties object types.
   */
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    id: PropTypes.number.isRequired,
    fromSaved: PropTypes.bool.isRequired
  }

  /**
   * Expected context object types.
   */
  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  /**
   * Render the provided structure.
   */
  render() {
    const {x, y, value, id, fromSaved} = this.props;

    const cx = classNames(
      "tile",
      `tile-${value}`,
      `cell-${x}-${y}`
    );

    let merged;
    if (fromSaved) merged = false;
    else merged = value !== 2;

    return (
      <ReactCSSTransitionGroup
        transitionName={merged ? "merged" : "tile"}
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
