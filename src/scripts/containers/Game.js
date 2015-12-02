import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Board} from "../components";
import * as Actions from "../actions/actions";

/**
 * Use for local styles.
 */
import styles from "../../styles/main.scss";

/**
 * How to:
 *
 * - Include images:
 *   <img src={require("../../images/name.svg")} />
 *   <img src={require("../../images/name.png")} />
 */

/**
 * ES7 Decorator
 *
 * Return your specific states/values to use in the component.
 *
 * - Example:
 *
 *   In decorator:
 *
 *     return {
 *       user: state.user
 *     }
 *
 *   In component:
 *
 *     const {user} = this.props;
 */
@connect(state => {
  return {
    state: state.game
  };
})
export default class App extends Component {
  constructor(props) {
    super(props);
    this.actions = bindActionCreators(Actions, this.props.dispatch);
  }

  static childContextTypes = {
    actions: PropTypes.object
  }

  getChildContext() {
    return {
      actions: this.actions
    };
  }

  render() {
    const children = this.props.children || [];
    children.push(<Board key="1" />);

    return (
      <main className={styles.wrapper}>
        {children}
      </main>
    );
  }
}
