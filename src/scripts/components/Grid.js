import _ from "lodash";

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
