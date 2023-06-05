import Gameboard from "../src/Gameboard";

describe("General Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });
});

describe("addShip", () => {
  test("a ship gets added to ships", () => {
    const testBoard = Gameboard();
    testBoard.addShip(2);
    expect(testBoard.ships).toHaveLength(1);
  });
});
