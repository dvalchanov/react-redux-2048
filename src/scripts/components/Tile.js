import {Component, PropTypes} from "react";

export default class Tile extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    value: PropTypes.number
  }

  componentDidMount() {
    setTimeout(() => {
    });
    //setTimeout(() => {
      //this.refs.tile.style.left = "70px";
    //}, 1000);
  }

  render() {
    const {x, y, value} = this.props;

    const styles = {
      top: 10 + (60 * x),
      left: 10 + (60 * y)
    };

    return (
      <div style={styles} ref="tile" className="tile tile-2">{value}</div>
    );
  }
}
