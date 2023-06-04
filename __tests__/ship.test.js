import Ship from "../src/ship";

describe("Basic Functionality", () => {
  test("Ship returns an object", () => {
    const testShip = Ship();
    expect(testShip).toBeInstanceOf(Object);
  });

  test("Ship has correct type prop", () => {
    const testShip = Ship(1);
    expect(testShip.type).toBe("Sentinel Probe");
  });

  test("Ship has correct size prop", () => {
    const testShip = Ship(1);
    expect(testShip.size).toBe(2);
  });
});
