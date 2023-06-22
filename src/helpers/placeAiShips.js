import randomShips from "./randomShips";

// This helper will attempt to add ships to the ai gameboard in a variety of ways for varying difficulty
const placeAiShips = (passedDiff, aiGameboard) => {
  // Grid size
  const gridHeight = 10;
  const gridWidth = 10;

  // Place a ship along edges until one successfully placed ?
  // Place a ship based on quadrant ?

  // Combine placement tactics to create varying difficulties
  const placeShips = (difficulty) => {
    // Totally random palcement
    if (difficulty === 1) {
      // Place ships randomly
      randomShips(aiGameboard, gridWidth, gridHeight);
    }
  };

  placeShips(passedDiff);
};

export default placeAiShips;
