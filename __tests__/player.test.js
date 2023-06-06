import Player from "../src/Player";

describe("Player basic functionality", () => {
  test("returns an object", () => {
    const testPlayer = Player();
    expect(testPlayer).toBeInstanceOf(Object);
  });
});
