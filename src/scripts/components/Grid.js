import _ from "lodash";

/**
 * Stateless Grid component, composed of a simple function.
 *
 * @param {Object}
 *  - `size` - the size fo the grid.
 */
export default ({size = 4}) => {
  const cells = _.range(Math.pow(size, 2));
  const cellViews = _.map(cells, index => {
    return <column key={index} />;
  });

  return (
    <container id="grid">
      {cellViews}
    </container>
  );
};
