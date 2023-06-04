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
  // Create the ship object that will be returned
  const newShip = {
    index,
    size: null,
    type: null,
    hits: 0,
    hit: null,
    isSunk: null,
  };
  // Add ship name based on index
  newShip.type = shipNames[newShip.index];

  return newShip;
};
export default Ship;
