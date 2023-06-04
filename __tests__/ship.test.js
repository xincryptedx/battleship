import Ship from "../src/ship";

describe("Basic Functionality", () => {
  test("Ship returns an object", () => {
    const testShip = Ship();
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
});
