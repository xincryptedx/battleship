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
    const mockHit = jest.fn();
    const mockShips = [
      {
        occupiedCells: [
          [2, 2],
          [2, 3],
        ],
        hit: mockHit,
      },
    ];
    testBoard.receiveAttack([2, 2], mockShips);
    expect(mockHit.mock.calls).toHaveLength(1);
  });

  test("hit method not called when no match found", () => {
    const testBoard = Gameboard();
    const mockHit = jest.fn();
    const mockShips = [
      {
        occupiedCells: [
          [2, 4],
          [2, 3],
        ],
        hit: mockHit,
      },
    ];
    testBoard.receiveAttack([2, 2], mockShips);
    expect(mockHit.mock.calls).toHaveLength(0);
  });

  test("hit method not called when undefined position", () => {
    const testBoard = Gameboard();
    const mockHit = jest.fn();
    const mockShips = [
      {
        occupiedCells: [
          [2, 4],
          [2, 3],
        ],
        hit: mockHit,
      },
    ];
    testBoard.receiveAttack(undefined, mockShips);
    expect(mockHit.mock.calls).toHaveLength(0);
  });

  test("hit method not called when falsy array values for position", () => {
    const testBoard = Gameboard();
    const mockHit = jest.fn();
    const mockShips = [
      {
        occupiedCells: [
          [2, 4],
          [2, 3],
        ],
        hit: mockHit,
      },
    ];
    testBoard.receiveAttack([null, NaN], mockShips);
    expect(mockHit.mock.calls).toHaveLength(0);
  });

  test("hit method not called when ships undefined", () => {
    const testBoard = Gameboard();
    const mockHit = jest.fn();
    testBoard.receiveAttack([2, 2], undefined);
    expect(mockHit.mock.calls).toHaveLength(0);
  });

  test("hit method not called when falsy non object array values for ships", () => {
    const testBoard = Gameboard();
    const mockHit = jest.fn();
    testBoard.receiveAttack([2, 2], [null, undefined, NaN, false]);
    expect(mockHit.mock.calls).toHaveLength(0);
  });

  test("hit method not called when invalid truthy array values for ships", () => {
    const testBoard = Gameboard();
    const mockHit = jest.fn();
    testBoard.receiveAttack([2, 2], ["abc", 23, true]);
    expect(mockHit.mock.calls).toHaveLength(0);
  });
});
