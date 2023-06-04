import Gameboard from "../src/Gameboard";

describe("Basic Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });

  test("Gameboard.addShip adds the correct cells to occupiedCells", () => {
    const testBoard = Gameboard();
    const testViper = testBoard.addShip([4, 4], "N", 3);
    expect(testBoard.occupiedCells).toEqual(
      { position: [4, 4], ship: testViper },
      { position: [4, 3], ship: testViper },
      { position: [4, 2], ship: testViper }
    );
  });
});
