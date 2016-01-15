import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Board, Result} from "js/components";
import * as Actions from "js/actions/actions";

// TODO - Implement variable grid size

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
 * Return specific states/values to use in the component.
 */
@connect(state => {
  return {
    score: state.game.get("score"),
    result: state.game.get("result")
  };
})
export default class Game extends Component {

  /**
   * On class initialization bind all the actions to the dispatch function.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.actions = bindActionCreators(Actions, this.props.dispatch);
  }

  /**
   * Expected properties object types.
   */
  static propTypes = {
    score: PropTypes.number.isRequired,
    result: PropTypes.number
  }

  /**
   * Expected context object types.
   */
  static childContextTypes = {
    actions: PropTypes.object
  }

  /**
   * Getter for the child context object.
   */
  getChildContext() {
    return {
      actions: this.actions
    };
  }

  /**
   * Render the provided structure.
   */
  render() {
    const {score, result} = this.props;

    let resultView;
    if (result) resultView = <Result result={result}/>;

    return (
      <main>
        <div id="score">
          {resultView}
          <h3>Score: {score}</h3>
        </div>
        <button onClick={this._handleNewGame}>New Game</button>
        <button onClick={this._handleSaveGame}>Save Game</button>
        <Board key="1" handleNewGame={this._handleNewGame} />
      </main>
    );
  }

  /**
   * Start a new game.
   */
  _handleNewGame = () => {
    this.actions.initGame();
  }

  /**
   * Save the current game`s state.
   */
  _handleSaveGame = () => {
    this.actions.saveGame();
  }
}
