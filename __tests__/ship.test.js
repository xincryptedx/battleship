import Ship from "../src/factories/Ship";

describe("Basic Functionality", () => {
  test("Ship returns an object", () => {
    const testShip = Ship(1, [2, 3], 0);
    expect(testShip).toBeInstanceOf(Object);
  });

  test("Ship has correct type prop", () => {
    const sentinel = Ship(1, [2, 3], 0);
    expect(sentinel.type).toBe("Sentinel Probe");

    const titan = Ship(2, [2, 3], 0);
    expect(titan.type).toBe("Assault Titan");

    const viper = Ship(3, [2, 3], 0);
    expect(viper.type).toBe("Viper Mech");

    const goliath = Ship(4, [2, 3], 0);
    expect(goliath.type).toBe("Iron Goliath");

    const leviathan = Ship(5, [2, 3], 0);
    expect(leviathan.type).toBe("Leviathan");
  });

  test("Ship has correct size prop", () => {
    const sentinel = Ship(1, [2, 3], 0);
    expect(sentinel.size).toBe(2);

    const titan = Ship(2, [2, 3], 0);
    expect(titan.size).toBe(3);

    const viper = Ship(3, [2, 3], 0);
    expect(viper.size).toBe(3);

    const goliath = Ship(4, [2, 3], 0);
    expect(goliath.size).toBe(4);

    const leviathan = Ship(5, [2, 3], 0);
    expect(leviathan.size).toBe(5);
  });

  test("Ship.hit() will increment hits prop", () => {
    const sentinel = Ship(1, [2, 3], 0);
    sentinel.hit();
    expect(sentinel.hits).toBe(1);
  });

  test("Ship.isSunk true if hits >= size", () => {
    const sentinel = Ship(1, [2, 3], 0);
    sentinel.hit();
    sentinel.hit();
    expect(sentinel.isSunk()).toBe(true);
  });

  test("Ship will add param coords to occupiedCells", () => {
    const goliath = Ship(4, [4, 4], 1);
    expect(goliath.occupiedCells).toEqual([
      [4, 4],
      [4, 5],
      [4, 3],
      [4, 2],
    ]);
  });

  test("Ship will add param coords accurately for all directions", () => {
    const sentinel = Ship(1, [4, 4], "N");
    expect(sentinel.occupiedCells).toEqual([
      [4, 4],
      [4, 3],
    ]);

    const setinel2 = Ship(1, [4, 4], "S");
    expect(setinel2.occupiedCells).toEqual([
      [4, 4],
      [4, 5],
    ]);

    const setinel3 = Ship(1, [4, 4], "E");
    expect(setinel3.occupiedCells).toEqual([
      [4, 4],
      [5, 4],
    ]);

    const setinel4 = Ship(1, [4, 4], "W");
    expect(setinel4.occupiedCells).toEqual([
      [4, 4],
      [3, 4],
    ]);
  });

  test("coords work properly for all ship types", () => {
    const setinel = Ship(1, [3, 6], "N");
    expect(setinel.occupiedCells).toEqual([
      [3, 6],
      [3, 5],
    ]);

    const titan = Ship(2, [2, 3], "S");
    expect(titan.occupiedCells).toEqual([
      [2, 3],
      [2, 4],
      [2, 5],
    ]);

    const viper = Ship(3, [4, 5], "E");
    expect(viper.occupiedCells).toEqual([
      [4, 5],
      [5, 5],
      [6, 5],
    ]);

    const goliath = Ship(4, [4, 6], "W");
    expect(goliath.occupiedCells).toEqual([
      [4, 6],
      [3, 6],
      [2, 6],
      [1, 6],
    ]);

    const leviathan = Ship(5, [5, 5], "N");
    expect(leviathan.occupiedCells).toEqual([
      [5, 5],
      [5, 4],
      [5, 3],
      [5, 2],
      [5, 1],
    ]);
  });
});

describe("Edge Cases", () => {
  test("returns undefined if index is not an int from 1 - 5", () => {
    expect(Ship(-1)).toBeUndefined();
    expect(Ship(0)).toBeUndefined();
    expect(Ship(3.5)).toBeUndefined();
    expect(Ship()).toBeUndefined();
    expect(Ship(NaN)).toBeUndefined();
    expect(Ship(null)).toBeUndefined();
    expect(Ship("index")).toBeUndefined();
    expect(Ship(undefined)).toBeUndefined();
    expect(Ship(false)).toBeUndefined();
  });

  test("occupiedCells will be empty if position not array", () => {
    let titan = Ship(2, null, "N");
    expect(titan.occupiedCells).toEqual([]);

    titan = Ship(2, 35, "N");
    expect(titan.occupiedCells).toEqual([]);

    titan = Ship(2, "coords", "N");
    expect(titan.occupiedCells).toEqual([]);
  });

  test("occupiedCells will be empty if direction not 'N','S','E', or 'W'", () => {
    let titan = Ship(2, [4, 4], "U");
    expect(titan.occupiedCells).toEqual([]);

    titan = Ship(2, [4, 4], null);
    expect(titan.occupiedCells).toEqual([]);

    titan = Ship(2, [4, 4], 45);
    expect(titan.occupiedCells).toEqual([]);
  });

  test("occupiedCells will be empty if position not array of two ints", () => {
    let titan = Ship(2, [], "N");
    expect(titan.occupiedCells).toEqual([]);

    titan = Ship(2, [null, undefined], "N");
    expect(titan.occupiedCells).toEqual([]);

    titan = Ship(2, [3.5, 2.342], "N");
    expect(titan.occupiedCells).toEqual([]);

    titan = Ship(2, [5, NaN], "N");
    expect(titan.occupiedCells).toEqual([]);
  });

  test("occupiedCells will return even if they are off the board", () => {
    const sentinel = Ship(1, [0, 0], "N");
    expect(sentinel.occupiedCells).toEqual([
      [0, 0],
      [0, -1],
    ]);

    const leviathan = Ship(5, [0, 0], "W");
    expect(leviathan.occupiedCells).toEqual([
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
      [-4, 0],
    ]);
  });
});
