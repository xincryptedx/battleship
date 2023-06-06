import Gameboard from "../src/Gameboard";

describe("General Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });
});

describe("addShip", () => {
  test("a valid ship gets added to ships", () => {
    const testBoard = Gameboard();
    testBoard.addShip(2, [4, 4], "N");
    expect(testBoard.ships).toHaveLength(1);
  });

  test("ships w/ negative coordinates will not be added", () => {
    const testBoard = Gameboard();
    testBoard.addShip(2, [0, 0], "N");
    expect(testBoard.ships).toHaveLength(0);
  });

  test("ships w/ too high coordinates will not be added", () => {
    const testBoard = Gameboard();
    testBoard.addShip(2, [10, 0], "N");
    expect(testBoard.ships).toHaveLength(0);
  });
});

describe("receiveAttack", () => {
  test("hit method called when attack coords found on a ships occupiedCells", () => {
    const testBoard = Gameboard();
    const mockShips = [
      {
        occupiedCells: [
          [2, 2],
          [2, 1],
        ],
        hits: 0,
      },
    ];
    testBoard.recieveAttack([2, 2], mockShips);
    expect(mockShips).toEqual([
      {
        occupiedCells: [
          [2, 2],
          [2, 1],
        ],
        hits: 1,
      },
    ]);
  });
});
