import Gameboard from "../src/Gameboard";
import Ship from "../src/Ship";

describe("General Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });
});

describe("addOccupiedCell", () => {
  test("testBoard occupiedCells gets correct cell added to it", () => {
    const testBoard = Gameboard();
    const testShip = Ship(1);
    testBoard.addOccupiedCell([4, 4], testShip);
    expect(testBoard.occupiedCells).toEqual([
      { position: [4, 4], ship: testShip },
    ]);
  });
});
