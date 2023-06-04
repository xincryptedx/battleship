import Gameboard from "../src/Gameboard";

describe("General Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });
});

describe("addOccupiedCell", () => {
  test("testBoard occupiedCells gets correct cell added to it", () => {
    const testBoard = Gameboard();
    testBoard.addOccupiedCell([4, 4], 3);
    expect(testBoard.occupiedCells).toEqual([
      { position: [4, 4], shipType: 3 },
    ]);
  });
});
