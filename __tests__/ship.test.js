import Ship from "../src/ship";

describe("Basic Functionality", () => {
  test("Ship returns an object", () => {
    const testShip = Ship();
    expect(testShip).toBeInstanceOf(Object);
  });

  test("Ship(1) returns an object with name prop:'Sentinel Probe'", () => {
    const testShip = Ship(1);
    expect(testShip.name).toBe("Sentinel Probe");
  });
});
