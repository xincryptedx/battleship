import Gameboard from "./Gameboard";

/* Factory that creates and returns a player object that can take a shot at opponent's game board */
const Player = (gm) => {
  let privateName = "";
  const thisPlayer = {
    get name() {
      return privateName;
    },
    set name(newName) {
      if (newName) {
        privateName = newName.toString();
      } else privateName = "";
    },
    gameboard: Gameboard(gm),
    sendAttack: null,
  };

  // Helper method for validating that attack position is on board
  const validateAttack = (position, gameboard) => {
    // Does gameboard exist with maxBoardX/y properties?
    if (!gameboard || !gameboard.maxBoardX || !gameboard.maxBoardY) {
      return false;
    }
    // Is position constrained to maxboardX/Y and both are ints in an array?
    if (
      position &&
      Array.isArray(position) &&
      position.length === 2 &&
      Number.isInteger(position[0]) &&
      Number.isInteger(position[1]) &&
      position[0] >= 0 &&
      position[0] <= gameboard.maxBoardX &&
      position[1] >= 0 &&
      position[1] <= gameboard.maxBoardY
    ) {
      return true;
    }
    return false;
  };

  // Method for sending attack to rival gameboard
  thisPlayer.sendAttack = (position, playerBoard = thisPlayer.gameboard) => {
    if (validateAttack(position, playerBoard)) {
      playerBoard.rivalBoard.receiveAttack(position);
    }
  };

  return thisPlayer;
};

export default Player;
