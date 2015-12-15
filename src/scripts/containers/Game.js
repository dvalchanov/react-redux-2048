import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Board, Result} from "../components";
import * as Actions from "../actions/actions";

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
    score: state.board.get("score"),
    result: state.board.get("result")
  };
})
export default class Game extends Component {
  constructor(props) {
    super(props);
    this.actions = bindActionCreators(Actions, this.props.dispatch);
  }

  static propTypes = {
    score: PropTypes.number.isRequired,
    result: PropTypes.number
  }

  static childContextTypes = {
    actions: PropTypes.object
  }

  getChildContext() {
    return {
      actions: this.actions
    };
  }

  handleNewGame = () => {
    this.actions.restartGame();
  }

  handleSaveGame = () => {
    this.actions.saveGame();
  }

  render() {
    const {score, result} = this.props;
    const children = this.props.children || [];
    children.push(<Board key="1" />);

    let resultView;
    if (result) resultView = <Result result={result}/>;

    return (
      <main>
        <div id="score">
          {resultView}
          <h3>Score: {score}</h3>
        </div>
        <button onClick={this.handleNewGame}>New Game</button>
        <button onClick={this.handleSaveGame}>Save Game</button>
        {children}
      </main>
    );
  }
}
