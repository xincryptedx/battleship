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

  test("player.name = other types should use that objects .toString()", () => {
    const testPlayer = Player();
    testPlayer.name = 123;
    expect(testPlayer.name).toBe("123");
  });

  test("player.name = falsy values returns ''", () => {
    const testPlayer = Player();
    testPlayer.name = null;
    expect(testPlayer.name).toBe("");
  });
});
