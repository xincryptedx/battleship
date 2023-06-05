// Contains the names for the ships based on index
const shipNames = {
  1: "Sentinel Probe",
  2: "Assault Titan",
  3: "Viper Mech",
  4: "Iron Goliath",
  5: "Leviathan",
};

// Factory that can create and return one of a variety of pre-determined ships.
const Ship = (index, position, direction) => {
  // Validate index
  if (!Number.isInteger(index) || index > 5 || index < 1) return undefined;

  // Create the ship object that will be returned
  const newShip = {
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
      newShip.size = 2;
      break;
    case 2:
      newShip.size = 3;
      break;
    default:
      newShip.size = index;
  }

  // Set ship name based on index
  newShip.type = shipNames[newShip.index];

  // Adds a hit to the ship
  newShip.hit = () => {
    newShip.hits += 1;
  };

  // Determines if ship sunk is true
  newShip.isSunk = () => {
    if (newShip.hits >= newShip.size) return true;
    return false;
  };

  // Turn direction into iterator
  const directionIterator = {
    N: [0, -1],
    S: [0, 1],
    E: [1, 0],
    W: [-1, 0],
  };

  // Use position and direction to add occupied cells coords
  if (Array.isArray[position] && position.length === 2) {
    for (let i = 0; i < newShip.size; i += 1) {
      const newCoords = [
        position[0] + i * directionIterator[direction][0],
        position[1] + i * directionIterator[direction][1],
      ];
      newShip.occupiedCells.push(newCoords);
    }
  }

  return newShip;
};
export default Ship;
