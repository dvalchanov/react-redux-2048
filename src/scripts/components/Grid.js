import _ from "lodash";

export default ({size = [4, 4]}) => {
  const cells = _.range(_.reduce(size, x => x * x));
  const cellViews = _.map(cells, index => {
    return <column key={index} />;
  });

  return (
    <container id="grid">
      {cellViews}
    </container>
  );
};
