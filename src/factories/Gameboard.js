import Ship from "./Ship";

/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
const Gameboard = () => {
  // Constraints for game board (10x10 grid, zero based)
  const maxBoardX = 9;
  const maxBoardY = 9;

  const thisGameboard = {
    ships: [],
    allOccupiedCells: [],
    addShip: null,
    receiveAttack: null,
    misses: [],
    hits: [],
    allSunk: null,
    rivalBoard: null,
    get maxBoardX() {
      return maxBoardX;
    },
    get maxBoardY() {
      return maxBoardY;
    },
  };

  // Method that validates ship occupied cell coords
  const validateShip = (ship) => {
    if (!ship) return false;
    // Flag for detecting invalid position value
    let isValid = false;

    // Check that ships occupied cells are all within map and not already occupied
    for (let i = 0; i < ship.occupiedCells.length; i += 1) {
      // On the map?
      if (
        ship.occupiedCells[i][0] >= 0 &&
        ship.occupiedCells[i][0] <= maxBoardX &&
        ship.occupiedCells[i][1] >= 0 &&
        ship.occupiedCells[i][1] <= maxBoardY
      ) {
        isValid = true;
      } else {
        isValid = false;
      }
    }

    return isValid;
  };

  // Method that adds occupied cells of valid boat to list
  const addCellsToList = (ship) => {
    ship.occupiedCells.forEach((cell) => {
      thisGameboard.allOccupiedCells.push(cell);
    });
  };

  // Method for adding a ship at a given coords in given direction if ship will fit on board
  thisGameboard.addShipInternal = (
    position,
    direction,
    shipTypeIndex = thisGameboard.ships.length + 1
  ) => {
    // Create the desired ship
    const newShip = Ship(shipTypeIndex, position, direction);
    // Add it to ships if it has valid occupied cells
    if (validateShip(newShip)) {
      addCellsToList(newShip);
      thisGameboard.ships.push(newShip);
    }
  };

  const addMiss = (position) => {
    thisGameboard.misses.push(position);
  };

  const addHit = (position) => {
    thisGameboard.hits.push(position);
  };

  // Method for responding to event that tries to create a user ship
  thisGameboard.addShip = (payload) => {
    thisGameboard.addShipInternal(payload.position, payload.direction);
  };

  // Method for receiving an attack from opponent
  thisGameboard.receiveAttack = (position, ships = thisGameboard.ships) => {
    // Validate position is 2 in array and ships is an array
    if (
      Array.isArray(position) &&
      position.length === 2 &&
      Number.isInteger(position[0]) &&
      Number.isInteger(position[1]) &&
      Array.isArray(ships)
    ) {
      // Each ship in ships
      for (let i = 0; i < ships.length; i += 1) {
        if (
          // If the ship is not falsy, and occupiedCells prop exists and is an array
          ships[i] &&
          ships[i].occupiedCells &&
          Array.isArray(ships[i].occupiedCells)
        ) {
          // For each of that ships occupied cells
          for (let j = 0; j < ships[0].occupiedCells.length; j += 1) {
            if (
              // If that cell matches the attack position
              ships[i].occupiedCells[j][0] === position[0] &&
              ships[i].occupiedCells[j][1] === position[1]
            ) {
              // Call that ships hit method and break out of loop
              ships[i].hit();
              addHit(position);
              return true;
            }
          }
        }
      }
    }
    addMiss(position);
    return false;
  };

  // Method that determines if all ships are sunk or not
  thisGameboard.allSunk = (shipArray = thisGameboard.ships) => {
    if (!shipArray || !Array.isArray(shipArray)) return undefined;
    let allSunk = true;
    shipArray.forEach((ship) => {
      if (ship && ship.isSunk && !ship.isSunk()) allSunk = false;
    });
    return allSunk;
  };

  return thisGameboard;
};

export default Gameboard;
