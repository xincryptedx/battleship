/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
const Gameboard = (mapX = 10, mapY = 10) => {
  const newBoard = {
    occupiedCells: [],
    addShip: null,
    recieveAttack: null,
    misses: [],
    hits: [],
  };

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  addShip = (coords, direction) => {
    // Are coords already in occupiedCells?
    // Will the ship fit in the desired direction?
    // Add the correct cells to occupied cells
  };

  return newBoard;
};

export default Gameboard;
