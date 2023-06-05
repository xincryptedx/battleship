import Gameboard from "../src/Gameboard";
import Ship from "../src/Ship";

describe("General Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });
});

describe("getShip", () => {
  test("a ship gets added to ships", () => {
    const testBoard = Gameboard();
    testBoard.getShip(2);
    expect(testBoard.ships).toHaveLength(1);
  });
});

describe("addOccupiedCell", () => {
  test("occupiedCells gets correct cell added to it", () => {
    const testBoard = Gameboard();
    const mockShip = {};
    testBoard.addOccupiedCell([4, 4], mockShip);
    expect(testBoard.occupiedCells).toEqual([
      { position: [4, 4], ship: mockShip },
    ]);
  });
});
