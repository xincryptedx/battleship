import events from "../modules/events";
/* Events Subbed:

*/

// This helper will attempt to add ships to the ai gameboard in a variety of ways for varying difficulty
const placeAiShips = (difficulty = 0) => {
  // Grid size
  const gridHeight = 10;
  const gridWidth = 10;

  // Copy of the ai ships array and method to get it
  let shipsCopy = [];
  const setAiShips = (ships) => {
    // Erase old ships data
    shipsCopy = [];
    ships.forEach((ship) => {
      shipsCopy.push(ship);
    });
    // Emit event signalling ships have been copied and are ready for use
    events.emit("aiShipsSet");
  };

  // Method that requests information about current user ships using event
  const requestAiShips = () => {
    events.emit("requestAiShips");
  };

  // Place a ship randomly until one successfully placed
  const placeRandomShip = () => {
    // Get random coordinates
    // Try the placement
  };
  // Place a ship along edges until one successfully placed
  // Place a ship based on quadrant
  // Combine placement tactics to create varying difficulties
};

export default placeAiShips;
