import Ship from "./Ship";

/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
const Gameboard = () => {
  const newBoard = {
    ships: [],
    addShip: null,
    receiveAttack: null,
    misses: [],
    hits: [],
  };

  // Method that validates ship occupied cell coords
  const validateShip = (ship) => {
    // Flag for detecting invalid position value
    let isValid = false;
    // Constraints for game board (10x10 grid, zero based)
    const maxBoardCoord = 9;
    // Check that ships occupied cells are all within map
    for (let i = 0; i < ship.occupiedCells.length; i += 1) {
      if (
        ship.occupiedCells[i][0] >= 0 &&
        ship.occupiedCells[i][0] <= maxBoardCoord &&
        ship.occupiedCells[i][1] >= 0 &&
        ship.occupiedCells[i][1] <= maxBoardCoord
      ) {
        isValid = true;
      } else {
        isValid = false;
      }
    }
    return isValid;
  };

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  newBoard.addShip = (shipTypeIndex, position, direction) => {
    // Create the desired ship
    const newShip = Ship(shipTypeIndex, position, direction);
    // Add it to ships if it has valid occupied cells
    if (validateShip(newShip)) newBoard.ships.push(newShip);
  };

  newBoard.receiveAttack = (position, ships = newBoard.ships) => {
    for (let i = 0; i < ships.length; i += 1) {
      for (let j = 0; j < ships[0].occupiedCells.length; j += 1) {
        if (
          ships[i].occupiedCells[j][0] === position[0] &&
          ships[i].occupiedCells[j][1] === position[1]
        ) {
          ships[i].hit();
          break;
        }
      }
    }
  };

  return newBoard;
};

export default Gameboard;
