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

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  newBoard.addShip = (shipTypeIndex, position, direction) => {
    // Create the desired ship
    const newShip = Ship(shipTypeIndex, position, direction);
    // Validate ship occupiedCells
    // Add it to ships
  };

  return newBoard;
};

export default Gameboard;
