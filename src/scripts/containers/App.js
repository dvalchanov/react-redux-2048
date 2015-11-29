import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import styles from "../../styles/main.scss";

@connect(state => {
  return {
    user: state.user
  }
})
export default class App extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  render() {
    const {user} = this.props;
    const children = this.props.children;

    return(
      <main className={styles.wrapper}>
        {children}
      </main>
    );
  }
}

