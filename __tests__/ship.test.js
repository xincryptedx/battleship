import Ship from "../src/Ship";

describe("Basic Functionality", () => {
  test("Ship returns an object", () => {
    const testShip = Ship(1);
    expect(testShip).toBeInstanceOf(Object);
  });

  test("Ship has correct type prop", () => {
    const sentinel = Ship(1);
    expect(sentinel.type).toBe("Sentinel Probe");

    const titan = Ship(2);
    expect(titan.type).toBe("Assault Titan");

    const viper = Ship(3);
    expect(viper.type).toBe("Viper Mech");

    const goliath = Ship(4);
    expect(goliath.type).toBe("Iron Goliath");

    const leviathan = Ship(5);
    expect(leviathan.type).toBe("Leviathan");
  });

  test("Ship has correct size prop", () => {
    const sentinel = Ship(1);
    expect(sentinel.size).toBe(2);

    const titan = Ship(2);
    expect(titan.size).toBe(3);

    const viper = Ship(3);
    expect(viper.size).toBe(3);

    const goliath = Ship(4);
    expect(goliath.size).toBe(4);

    const leviathan = Ship(5);
    expect(leviathan.size).toBe(5);
  });

  test("Ship.hit() will increment hits prop", () => {
    const sentinel = Ship(1);
    sentinel.hit();
    expect(sentinel.hits).toBe(1);
  });

  test("Ship.isSunk true if hits >= size", () => {
    const sentinel = Ship(1);
    sentinel.hit();
    sentinel.hit();
    expect(sentinel.isSunk()).toBe(true);
  });

  test("Ship will add param coords to occupiedCells", () => {
    const sentinel = Ship(1, [4, 4], "N");
    expect(sentinel.occupiedCells).toEqual([
      [4, 4],
      [4, 3],
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
});
