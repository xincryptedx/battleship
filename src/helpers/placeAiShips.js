// This helper will attempt to add ships to the ai gameboard in a variety of ways for varying difficulty
const placeAiShips = (passedDiff, aiGameboard) => {
  // Grid size
  const gridHeight = 10;
  const gridWidth = 10;

  // Copy of the ai ships array and method to get it
  const aiShips = aiGameboard.ships;

  // Place a ship randomly
  const placeRandomShip = () => {
    // Get random placement
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    const direction = Math.round(Math.random());
    // Try the placement

    aiGameboard.addShip([x, y], direction);
  };
  // Place a ship along edges until one successfully placed
  // Place a ship based on quadrant

  // Waits for a aiShipsSet event
  function waitForAiShipsSet() {
    // Refactor
  }

  // Combine placement tactics to create varying difficulties
  const placeShips = async (difficulty) => {
    // Totally random palcement
    if (difficulty === 1 && aiShips.length <= 4) {
      // Try random placement
      placeRandomShip();

      // Wait for returnAiShips
      await waitForAiShipsSet();
      // Recursively call fn until ships placed
      placeShips(difficulty);
    }
  };

  placeShips(passedDiff);
  console.log(aiShips);
};

export default placeAiShips;
