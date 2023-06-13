import events from "../modules/events";
/* Events Subbed:

*/

// This helper will attempt to add ships to the ai gameboard in a variety of ways for varying difficulty
const placeAiShips = (passedDiff) => {
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
    console.log("AI Ships copy set:", shipsCopy);
  };

  // Method that requests information about current user ships using event
  const requestAiShips = () => {
    events.emit("requestAiShips");
  };

  // Place a ship randomly until one successfully placed
  const placeRandomShip = () => {
    // Get random placement
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    const direction = Math.round(Math.random());
    // Try the placement
    events.emit("tryAiPlacement", { position: [x, y], direction });
    console.log("Trying AI placement: ", x, y, direction);
  };
  // Place a ship along edges until one successfully placed
  // Place a ship based on quadrant

  // Waits for a aiShipsSet event
  function waitForAiShipsSet() {
    return new Promise((resolve) => {
      events.once("aiShipsSet", (isAI) => {
        if (isAI) resolve(true);
      });
      // Update ships
      requestAiShips();
    });
  }

  // Combine placement tactics to create varying difficulties
  const placeShips = async (difficulty) => {
    // Totally random palcement
    if (difficulty === 1 && shipsCopy.length <= 4) {
      // Try random placement
      placeRandomShip();

      // Wait for returnAiShips
      await waitForAiShipsSet();
      // Recursively call fn until ships placed
      placeShips(difficulty);
    }
  };

  // Sub to events
  events.on("returnAiShips", setAiShips);

  return placeShips(passedDiff);
};

export default placeAiShips;
