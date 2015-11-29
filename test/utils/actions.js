import {expect} from "chai";
import {generateActions} from "../../src/scripts/utils/actions";

describe("[utils] Actions", () => {
  it("should handle multiple actions generation", () => {
    const login = "LOGIN";
    const signup = "SIGN_UP";

    const params = [login, signup];
    const expected = {
      [login]: login,
      [signup]: signup
    };

    expect(generateActions(params)).to.deep.equal(expected);
  });
});
