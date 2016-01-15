import {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Board, Result} from "js/components";
import * as Actions from "js/actions/actions";

// TODO - Use instead of css
//size: 300,
//ratio: 15 / 2,
//count: 5,
//padding: board.count + 1,
//cellSize: board.size / (board.count + (board.padding / board.ratio)),
//cellPadding: board.cell / board.ratio

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
   * Component's state.
   */
  state = {
    size: 5
  };

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
        <Board key="1" size={this.state.size} handleNewGame={this._handleNewGame} />
        <div id="board-size">
          <span className="btn minus" onClick={this._handleDecrease} />
          <span className="size">{this.state.size}</span>
          <span className="btn plus" onClick={this._handleIncrease} />
        </div>
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

  /**
   * Increase the size of the board.
   */
  _handleDecrease = () => {
    this.setState({size: this.state.size - 1});
  }

  /**
   * Decrease the size of the board.
   */
  _handleIncrease = () => {
    this.setState({size: this.state.size + 1});
  }
}
