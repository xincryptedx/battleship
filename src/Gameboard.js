import Ship from "./Ship";

/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
const Gameboard = () => {
  const newBoard = {
    ships: [],
    getShip: null,
    addShip: null,
    occupiedCells: [],
    addOccupiedCell: null,
    addCells: null,
    recieveAttack: null,
    misses: [],
    hits: [],
  };

  // Method for getting a new ship and adding it to ships
  newBoard.getShip = (shipTypeIndex) => {
    const newShip = Ship(shipTypeIndex);
    newBoard.ships.push(newShip);
  };

  // Method for adding an occupied cell
  newBoard.addOccupiedCell = (position, ship) => {
    const newCell = { position, ship };
    newBoard.occupiedCells.push(newCell);
  };

  // Method for adding all cells required for a ship
  newBoard.addCells = (coords, ship, direction) => {};

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  newBoard.addShip = (coords, shipTypeIndex, direction) => {
    // Are coords already in occupiedCells?
    // Will the ship fit in the desired direction
    // Create the ship and add it to ships
    // Add the correct cells to occupied cells
  };

  return newBoard;
};

export default Gameboard;
