import Ship from "../src/ship";

describe("Basic Functionality", () => {
  test("Ship returns an object", () => {
    const testShip = Ship();
    expect(testShip).toBeInstanceOf(Object);
  });

  test("Ship returns object with correct type prop", () => {
    const testShip = Ship(1);
    expect(testShip.type).toBe("Sentinel Probe");
  });
});
