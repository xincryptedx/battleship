import Player from "../src/Player";

describe("Player basic functionality", () => {
  test("returns an object", () => {
    const testPlayer = Player();
    expect(testPlayer).toBeInstanceOf(Object);
  });
});

describe("Player Name", () => {
  test('player.name = "string" should set name to string', () => {
    const testPlayer = Player();
    testPlayer.name = "string";
    expect(testPlayer.name).toBe("string");
  });
});
