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

  // Turn direction into iterator
  const directionIterator = {
    N: [0, -1],
    S: [0, 1],
    E: [1, 0],
    W: [-1, 0],
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
    for (let i = 0; i < thisShip.size; i += 1) {
      const newCoords = [
        position[0] + i * directionIterator[direction][0],
        position[1] + i * directionIterator[direction][1],
      ];
      thisShip.occupiedCells.push(newCoords);
    }
  }

  return thisShip;
};
export default Ship;
