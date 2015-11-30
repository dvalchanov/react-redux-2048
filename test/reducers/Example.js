import {expect} from "chai";
import {Map} from "immutable";
import reducer from "../../src/scripts/reducers/Example";

describe("Account reducer", () => {
  const defaultState = {};

  it("should have default state", () => {
    const expected = defaultState;

    expect(reducer(undefined, {type: null}).toJS()).to.deep.equal(expected);
  });
});
