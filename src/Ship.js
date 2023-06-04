// Contains the names for the ships based on index
const shipNames = {
  1: "Sentinel Probe",
  2: "Assault Titan",
  3: "Viper Mech",
  4: "Iron Goliath",
  5: "Leviathan",
};

// Factory that can create and return one of a variety of pre-determined ships.
const Ship = (index) => {
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
  // Add ship name based on index
  newShip.type = shipNames[newShip.index];

  // Add hit method
  newShip.hit = () => {
    newShip.hits += 1;
  };

  newShip.isSunk = () => {
    if (newShip.hits >= newShip.size) return true;
    return false;
  };

  return newShip;
};
export default Ship;