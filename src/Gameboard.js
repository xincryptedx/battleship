import Ship from "./Ship";

/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
const Gameboard = () => {
  const newBoard = {
    occupiedCells: [],
    addOccupiedCell: null,
    addShip: null,
    recieveAttack: null,
    misses: [],
    hits: [],
  };

  // Method for adding an occupied cell
  newBoard.addOccupiedCell = (position, shipType) => {
    const newCell = { position, shipType };
    newBoard.occupiedCells.push(newCell);
  };

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  newBoard.addShip = (coords, direction, shipTypeIndex) => {
    const newShip = Ship(shipTypeIndex);
    // Are coords already in occupiedCells?
    // Will the ship fit in the desired direction?
    // Add the correct cells to occupied cells
    return newShip;
  };

  return newBoard;
};

export default Gameboard;
