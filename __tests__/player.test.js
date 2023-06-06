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

  test("player.name = anything else should use that things .toString()", () => {
    const testPlayer = Player();
    testPlayer.name = 123;
    expect(testPlayer.name).toBe("123");
  });
});
