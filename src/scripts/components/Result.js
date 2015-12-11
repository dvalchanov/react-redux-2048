import {Component, PropTypes} from "react";

import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class Result extends Component {
  static propTypes = {
    result: PropTypes.number.isRequired
  }

  static contextTypes = {
    actions: PropTypes.object.isRequired
  }

  componentDidMount() {
    const result = this.refs.result;
    result.addEventListener("transitionend", this.onTransitionEnd, false);
  }

  onTransitionEnd = () => {
    this.context.actions.resetResult();
  }

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
}
