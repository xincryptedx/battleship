import Gameboard from "../src/Gameboard";

describe("Basic Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });
});
