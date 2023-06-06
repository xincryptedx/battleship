import Player from "../src/Player";

describe("Player basic functionality", () => {
  test("returns an object", () => {
    const testPlayer = Player();
    expect(testPlayer).toBeInstanceOf(Object);
  });
});

// Set function for player name
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
    testPlayer.name = "My Name"; // Removes default '' value for name
    testPlayer.name = null;
    expect(testPlayer.name).toBe("");
    testPlayer.name = undefined;
    expect(testPlayer.name).toBe("");
    testPlayer.name = NaN;
    expect(testPlayer.name).toBe("");
  });
});

// Method for sending attacks to rival board
describe("sendAttack", () => {
  test("receiveAttack is invoked on opponent board", () => {
    const mockReceiveAttack = jest.fn();
    const mockRivalBoard = {
      maxBoardX: 9,
      maxBoardY: 9,
      receiveAttack: mockReceiveAttack,
    };
    const mockPlayerBoard = {
      maxBoardX: 9,
      maxBoardY: 9,
      rivalBoard: mockRivalBoard,
    };
    const testPlayer = Player();
    testPlayer.sendAttack([2, 4], mockPlayerBoard);
    expect(mockReceiveAttack.mock.calls).toHaveLength(1);
  });

  test("receiveAttack not invoked when invalid board param", () => {
    const mockReceiveAttack = jest.fn();
    const testPlayer = Player();
    testPlayer.sendAttack([2, 4], null);
    expect(mockReceiveAttack.mock.calls).toHaveLength(0);
  });

  test("receiveAttack not invoked when invalid position param", () => {
    const mockReceiveAttack = jest.fn();
    const mockRivalBoard = {
      maxBoardX: 9,
      maxBoardY: 9,
      receiveAttack: mockReceiveAttack,
    };
    const mockPlayerBoard = {
      maxBoardX: 9,
      maxBoardY: 9,
      rivalBoard: mockRivalBoard,
    };
    const testPlayer = Player();
    testPlayer.sendAttack([20, 4], mockPlayerBoard);
    expect(mockReceiveAttack.mock.calls).toHaveLength(0);
  });
});
