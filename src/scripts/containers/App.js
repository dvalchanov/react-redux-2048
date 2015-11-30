import {Component} from "react";
import {connect} from "react-redux";

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
    state: state
  };
})
export default class App extends Component {
  render() {
    const children = this.props.children;

    return (
      <main className={styles.wrapper}>
        {children}
      </main>
    );
  }
}
