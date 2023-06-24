import Ship from "./Ship";
import aiAttack from "../helpers/aiAttack/aiAttack";

/* Factory that returns a gameboard that can place ships with Ship(), recieve attacks based on coords 
   and then decides whether to hit() if ship is in that spot, records hits and misses, and reports if
   all its ships have been sunk. */
const Gameboard = (gm) => {
  const thisGameboard = {
    maxBoardX: 9,
    maxBoardY: 9,
    ships: [],
    allOccupiedCells: [],
    cellsToCheck: [],
    misses: [],
    hits: [],
    direction: 1,
    hitShipType: null,
    isAi: false,
    isAutoAttacking: false,
    isAiSeeking: true,
    gameOver: false,
    canAttack: true,
    rivalBoard: null,
    canvas: null,
    addShip: null,
    receiveAttack: null,
    allSunk: null,
    logSunk: null,
    alreadyAttacked: null,
  };

  // Method that validates ship occupied cell coords
  const validateShip = (ship) => {
    if (!ship) return false;
    // Flag for detecting invalid position value
    let isValid = true;

    // Check that ships occupied cells are all within map and not already occupied
    for (let i = 0; i < ship.occupiedCells.length; i += 1) {
      // On the map?
      if (
        ship.occupiedCells[i][0] >= 0 &&
        ship.occupiedCells[i][0] <= thisGameboard.maxBoardX &&
        ship.occupiedCells[i][1] >= 0 &&
        ship.occupiedCells[i][1] <= thisGameboard.maxBoardY
      ) {
        // Do nothing
      } else {
        isValid = false;
      }
      // Check occupied cells
      const isCellOccupied = thisGameboard.allOccupiedCells.some(
        (cell) =>
          // Coords found in all occupied cells already
          cell[0] === ship.occupiedCells[i][0] &&
          cell[1] === ship.occupiedCells[i][1]
      );

      if (isCellOccupied) {
        isValid = false;
        break; // Break out of the loop if occupied cell is found
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
  thisGameboard.addShip = (
    position,
    direction = thisGameboard.direction,
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
    if (position) {
      thisGameboard.misses.push(position);
    }
  };

  const addHit = (position, ship) => {
    if (position) {
      thisGameboard.hits.push(position);
    }

    // Set the most recently hit ship
    thisGameboard.hitShipType = ship.type;
  };

  // Method for receiving an attack from opponent
  thisGameboard.receiveAttack = (position, ships = thisGameboard.ships) =>
    new Promise((resolve) => {
      // Validate position is 2 in array and ships is an array, and rival board can attack
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
            for (let j = 0; j < ships[i].occupiedCells.length; j += 1) {
              if (
                // If that cell matches the attack position
                ships[i].occupiedCells[j][0] === position[0] &&
                ships[i].occupiedCells[j][1] === position[1]
              ) {
                // Call that ships hit method and break out of loop
                ships[i].hit();
                addHit(position, ships[i]);
                resolve(true);
                return;
              }
            }
          }
        }
      }
      addMiss(position);
      resolve(false);
    });

  // Method for trying ai attacks
  thisGameboard.tryAiAttack = (delay) => {
    // Return if not ai or game is over
    if (thisGameboard.isAi === false) return;
    aiAttack(gm, delay);
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

  // Object for tracking board's sunken ships
  thisGameboard.sunkenShips = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };

  // Method for reporting sunken ships
  thisGameboard.logSunk = () => {
    let logMsg = null;
    Object.keys(thisGameboard.sunkenShips).forEach((key) => {
      if (
        thisGameboard.sunkenShips[key] === false &&
        thisGameboard.ships[key - 1].isSunk()
      ) {
        const ship = thisGameboard.ships[key - 1].type;
        const player = thisGameboard.isAi ? "AI's" : "User's";
        logMsg = `<span style="color: red">${player} ${ship} was destroyed!</span>`;
        thisGameboard.sunkenShips[key] = true;
        // Call the method for responding to user ship sunk on game manager
        if (!thisGameboard.isAi) gm.userShipSunk(thisGameboard.ships[key - 1]);
      }
    });
    return logMsg;
  };

  // Method for determining if a position is already attacked
  thisGameboard.alreadyAttacked = (attackCoords) => {
    let attacked = false;

    thisGameboard.hits.forEach((hit) => {
      if (attackCoords[0] === hit[0] && attackCoords[1] === hit[1]) {
        attacked = true;
      }
    });

    thisGameboard.misses.forEach((miss) => {
      if (attackCoords[0] === miss[0] && attackCoords[1] === miss[1]) {
        attacked = true;
      }
    });

    return attacked;
  };

  return thisGameboard;
};

export default Gameboard;
