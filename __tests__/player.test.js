import Player from "../src/factories/Player";

describe("Player basic functionality", () => {
  test("returns an object", () => {
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    expect(testPlayer).toBeInstanceOf(Object);
  });
});

// Set function for player name
describe("Player Name", () => {
  test('player.name = "string" should set name to string', () => {
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    testPlayer.name = "string";
    expect(testPlayer.name).toBe("string");
  });

  test("player.name = other types should use that objects .toString()", () => {
    const gmMock = {};
    const testPlayer = Player(gmMock);
    testPlayer.name = 123;
    expect(testPlayer.name).toBe("123");
  });

  test("player.name = falsy values returns ''", () => {
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
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
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    testPlayer.sendAttack([2, 4], mockPlayerBoard);
    expect(mockReceiveAttack.mock.calls).toHaveLength(1);
  });

  test("receiveAttack not invoked when invalid board param", () => {
    const mockReceiveAttack = jest.fn();
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    testPlayer.sendAttack([2, 4], null);
    expect(mockReceiveAttack.mock.calls).toHaveLength(0);
  });

  test("receiveAttack not invoked when boards missing req params", () => {
    const mockReceiveAttack = jest.fn();
    const mockRivalBoard = {
      receiveAttack: mockReceiveAttack,
    };
    const mockPlayerBoard = {
      rivalBoard: mockRivalBoard,
    };
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    testPlayer.sendAttack([2, 4], mockPlayerBoard);
    expect(mockReceiveAttack.mock.calls).toHaveLength(0);
  });

  test("receiveAttack not invoked when off board position param", () => {
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
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    testPlayer.sendAttack([20, 4], mockPlayerBoard);
    expect(mockReceiveAttack.mock.calls).toHaveLength(0);
  });

  test("receiveAttack not invoked when non-array position param", () => {
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
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    testPlayer.sendAttack(null, mockPlayerBoard);
    expect(mockReceiveAttack.mock.calls).toHaveLength(0);
  });

  test("receiveAttack not invoked when non-int entries in position param", () => {
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
    const gmMock = {}; // Mock gameManager
    const testPlayer = Player(gmMock);
    testPlayer.sendAttack([2.5, "abc"], mockPlayerBoard);
    expect(mockReceiveAttack.mock.calls).toHaveLength(0);
  });
});
