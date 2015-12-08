import {Component, PropTypes} from "react";
import classNames from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class Tile extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    merged: PropTypes.bool.isRequired
  }

  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (this.props.merged) {
      setTimeout(() => {
        this.context.actions.merged(this.props.id);
        // Do this on transition end!!
      }, 500);
    }
  }

  render() {
    const {x, y, value, id, merged} = this.props;

    const cx = classNames(
      "tile",
      `tile-${value}`,
      `cell-${x}-${y}`
    );

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
