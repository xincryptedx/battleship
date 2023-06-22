import cellProbs from "./cellProbs";

// Module that allows ai to make attacks based on probability a cell will result
// in a hit. Uses Bayesian inference along with two Battleship game theories.
const probs = cellProbs();

// This helper will look at current hits and misses and then return an attack
const aiAttack = (gm, delay) => {
  const gridHeight = 10;
  const gridWidth = 10;
  let attackCoords = [];

  // Update cell hit probabilities
  probs.updateProbs(gm);

  // Method for returning random attack
  const randomAttack = () => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
    console.log("Selected attack coordinates:", attackCoords);
  };

  // Set random attack  coords that have not been attacked
  randomAttack();
  while (gm.userBoard.alreadyAttacked(attackCoords)) {
    console.log(
      "Attack coordinates already attacked. Selecting new coordinates..."
    );

    randomAttack();
  }
  console.log("Final attack coordinates:", attackCoords);

  // Send attack to game manager
  gm.aiAttacking(attackCoords, delay);
};

export default aiAttack;
