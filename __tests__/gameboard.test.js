import Gameboard from "../src/Gameboard";

describe("Basic Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });

  test("Gameboard has a default size of 10x10", () => {
    const testBoard = Gameboard();
    expect(testBoard.map).toHaveLength(10);
    for (let i = 0; i < testBoard.map.length; i += 1) {
      expect(testBoard.map[i].length).toHaveLength(10);
    }
  });
});
