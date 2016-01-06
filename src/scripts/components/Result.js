import {Component, PropTypes} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class Result extends Component {

  /**
   * Expected properties object types.
   */
  static propTypes = {
    result: PropTypes.number.isRequired
  }

  /**
   * Expected context object types.
   */
  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  /**
   * Called only once.
   *
   * Initialize an listener for the transition end event.
   */
  componentDidMount() {
    const result = this.refs.result;
    result.addEventListener("transitionend", this._onTransitionEnd, false);
  }

  /**
   * Render the provided structure.
   */
  render() {
    const {result} = this.props;

    return (
      <ReactCSSTransitionGroup
        transitionName="result"
        transitionAppear={true}
        transitionLeave={false}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        transitionAppearTimeout={0} >
        <div ref="result" className="result">+{result}</div>
      </ReactCSSTransitionGroup>
    );
  }

  /**
   * Reset the result field after the transition has ended.
   */
  _onTransitionEnd = () => {
    this.context.actions.resetResult();
  }
}
