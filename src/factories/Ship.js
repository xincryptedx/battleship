/* This module is a factory used by the Gameboard factory module to populate gameboards with
  ships. A ship object will be returned that includes various information about the state
  of the ship such as what cells it occupies, its size, type, etc. */

// Contains the names for the ships based on index
const shipNames = {
  1: "Sentinel Probe",
  2: "Assault Titan",
  3: "Viper Mech",
  4: "Iron Goliath",
  5: "Leviathan",
};

// Factory for creating ships
const Ship = (index, position, direction) => {
  // Validate index
  if (!Number.isInteger(index) || index > 5 || index < 1) return undefined;

  // Create the ship object that will be returned
  const thisShip = {
    index,
    size: null,
    type: null,
    hits: 0,
    hit: null,
    isSunk: null,
    occupiedCells: [],
  };

  // Set ship size
  switch (index) {
    case 1:
      thisShip.size = 2;
      break;
    case 2:
      thisShip.size = 3;
      break;
    default:
      thisShip.size = index;
  }

  // Set ship name based on index
  thisShip.type = shipNames[thisShip.index];

  // Adds a hit to the ship
  thisShip.hit = () => {
    thisShip.hits += 1;
  };

  // Determines if ship sunk is true
  thisShip.isSunk = () => {
    if (thisShip.hits >= thisShip.size) return true;
    return false;
  };

  // Placement direction is either 0 for horizontal or 1 for vertical
  let placementDirectionX = 0;
  let placementDirectionY = 0;
  if (direction === 0) {
    placementDirectionX = 1;
    placementDirectionY = 0;
  } else if (direction === 1) {
    placementDirectionX = 0;
    placementDirectionY = 1;
  }

  // Use position and direction to add occupied cells coords
  if (
    Array.isArray(position) &&
    position.length === 2 &&
    Number.isInteger(position[0]) &&
    Number.isInteger(position[1]) &&
    (direction === 1 || direction === 0)
  ) {
    // Divide length into half and remainder
    const halfSize = Math.floor(thisShip.size / 2);
    const remainderSize = thisShip.size % 2;
    // Add first half of cells plus remainder in one direction
    for (let i = 0; i < halfSize + remainderSize; i += 1) {
      const newCoords = [
        position[0] + i * placementDirectionX,
        position[1] + i * placementDirectionY,
      ];
      thisShip.occupiedCells.push(newCoords);
    }
    // Add second half of cells
    for (let i = 0; i < halfSize; i += 1) {
      const newCoords = [
        position[0] - (i + 1) * placementDirectionX,
        position[1] - (i + 1) * placementDirectionY,
      ];
      thisShip.occupiedCells.push(newCoords);
    }
  }

  return thisShip;
};
export default Ship;
