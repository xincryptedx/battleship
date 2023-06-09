import Gameboard from "../src/factories/Gameboard";

// Basic game boad factory functionality
describe("General Functionality", () => {
  test("Gameboard returns an object", () => {
    const testBoard = Gameboard();
    expect(testBoard).toBeInstanceOf(Object);
  });
});

// Method for adding shipt to game board
describe("addShip", () => {
  test("a valid ship gets added to ships", () => {
    const testBoard = Gameboard();
    testBoard.addShip([4, 4], 0, 2);
    expect(testBoard.ships).toHaveLength(1);
  });

  test("index not getting passed results in ships created incrementally", () => {
    const testBoard = Gameboard(); // Ships placed next to each other vertically
    // Add first ship
    testBoard.addShip([4, 4], 1);
    expect(testBoard.ships[0].size).toBe(2);
    // Add second ship
    testBoard.addShip([5, 4], 1);
    expect(testBoard.ships[1].size).toBe(3);
    // Add third ship
    testBoard.addShip([6, 4], 1);
    expect(testBoard.ships[2].size).toBe(3);
    // Add fourth ship
    testBoard.addShip([7, 4], 1);
    expect(testBoard.ships[3].size).toBe(4);
    // Add fifth ship
    testBoard.addShip([8, 4], 1);
    expect(testBoard.ships[4].size).toBe(5);
  });

  test("default index above max will return undefined", () => {
    const testBoard = Gameboard(); // Ships placed next to each other vertically
    // Add first ship
    testBoard.addShip([4, 4], 1);
    expect(testBoard.ships[0].size).toBe(2);
    // Add second ship
    testBoard.addShip([5, 4], 1);
    expect(testBoard.ships[1].size).toBe(3);
    // Add third ship
    testBoard.addShip([6, 4], 1);
    expect(testBoard.ships[2].size).toBe(3);
    // Add fourth ship
    testBoard.addShip([7, 4], 1);
    expect(testBoard.ships[3].size).toBe(4);
    // Add fifth ship
    testBoard.addShip([8, 4], 1);
    expect(testBoard.ships[4].size).toBe(5);

    expect(testBoard.addShip([9, 4], 0)).toBeUndefined();
  });

  test("ships w/ negative coordinates will not be added", () => {
    const testBoard = Gameboard();
    testBoard.addShip([0, 0], 0, 2);
    expect(testBoard.ships).toHaveLength(0);
  });

  test("ships w/ too high coordinates will not be added", () => {
    const testBoard = Gameboard();
    testBoard.addShip([10, 0], 0, 2);
    expect(testBoard.ships).toHaveLength(0);
  });

  test("ships that have cells that are already occupied will not be added", () => {
    const testBoard = Gameboard();
    testBoard.addShip([4, 4], 1, 2);
    testBoard.addShip([4, 3], 1, 3);
    expect(testBoard.ships).toHaveLength(1);
  });
});

/* Method for taking an attack from opponent. Returns true if hit, false if miss, 
   and records position of attack to proper array, hits or misses, on game board */
describe("receiveAttack", () => {
  test("returns true when match found", () => {
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
    testBoard.receiveAttack([2, 2], mockShips).then((result) => {
      expect(result).toBe(true);
    });
  });

  test("returns false when match not found", () => {
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
    testBoard.receiveAttack([4, 4], mockShips).then((result) => {
      expect(result).toBe(false);
    });
  });

  test("hit recorded to testBoard.hits array", () => {
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
    testBoard.receiveAttack([2, 3], mockShips);
    expect(testBoard.hits).toEqual([
      [2, 2],
      [2, 3],
    ]);
  });

  test("miss recorded to testBoard.misses array", () => {
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
    testBoard.receiveAttack([3, 2], mockShips);
    testBoard.receiveAttack([3, 3], mockShips);
    expect(testBoard.misses).toEqual([
      [3, 2],
      [3, 3],
    ]);
  });

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

// Method that checks isSunk for all ships and returns true if all sunk or false otherwise
describe("allSunk", () => {
  test("if all ships isSunk true, return true", () => {
    const testBoard = Gameboard();
    const mockIsSunk = () => true;
    const mockShips = [
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
    ];
    expect(testBoard.allSunk(mockShips)).toBe(true);
  });

  test("if any ship isSunk false, return false", () => {
    const testBoard = Gameboard();
    const mockIsSunk = () => true;
    const mockIsNotSunk = () => false;
    const mockShips = [
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
      { isSunk: mockIsNotSunk },
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
    ];
    expect(testBoard.allSunk(mockShips)).toBe(false);
  });

  test("if shipsArray is not an array return undefined", () => {
    const testBoard = Gameboard();
    const mockShips = null;
    expect(testBoard.allSunk(mockShips)).toBeUndefined();
  });

  test("things in array with no isSunk method are ignored", () => {
    const testBoard = Gameboard();
    const mockIsSunk = () => true;
    const mockShips = [
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
      { wrongFn: () => "r.i.p." },
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
    ];
    expect(testBoard.allSunk(mockShips)).toBe(true);
  });

  test("falsy array entries are ignored", () => {
    const testBoard = Gameboard();
    const mockIsSunk = () => true;
    const mockShips = [
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
      null,
      undefined,
      NaN,
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
    ];
    expect(testBoard.allSunk(mockShips)).toBe(true);
  });

  test("invalid truthy entries are ignored", () => {
    const testBoard = Gameboard();
    const mockIsSunk = () => true;
    const mockShips = [
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
      500,
      "abc",
      false,
      { isSunk: mockIsSunk },
      { isSunk: mockIsSunk },
    ];
    expect(testBoard.allSunk(mockShips)).toBe(true);
  });
});
