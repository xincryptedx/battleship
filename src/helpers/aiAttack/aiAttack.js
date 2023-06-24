import cellProbs from "./cellProbs";

// Module that allows ai to make attacks based on probability a cell will result
// in a hit. Uses Bayesian inference along with two Battleship game theories.
const probs = cellProbs();

// This helper will look at current hits and misses and then return an attack
const aiAttack = (gm, delay) => {
  const gridHeight = 10;
  const gridWidth = 10;
  let attackCoords = [];
  let { isSeeking } = gm.aiGameboard;

  // Update cell hit probabilities
  probs.updateProbs(gm);

  // Method for returning random attack
  const findRandomAttack = () => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Method that finds largest value in 2d array
  const findGreatestProbAttack = () => {
    const allProbs = probs.probs;
    let max = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < allProbs.length; i += 1) {
      for (let j = 0; j < allProbs[i].length; j += 1) {
        if (allProbs[i][j] > max) {
          max = allProbs[i][j];
          attackCoords = [i, j];
        }
      }
    }
  };

  // Random attack if ai difficulty is 1
  if (gm.aiDifficulty === 1) {
    // Set random attack  coords that have not been attacked
    findRandomAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findRandomAttack();
    }
  }

  // Do an attack based on probabilities if ai difficulty is 2 and is seeking
  else if (gm.aiDifficulty === 2 && isSeeking) {
    findGreatestProbAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findGreatestProbAttack();
    }
  }

  // Do an attack based on destroy behavior after a hit is found
  else if (gm.aiDifficulty === 2 && !isSeeking) {
    // Get coords using destroy method
    const coords = probs.destroyFoundShip();
    // If no coords are returned instead use seeking strat
    if (!coords) {
      isSeeking = true;
      findGreatestProbAttack();
      while (gm.userBoard.alreadyAttacked(attackCoords)) {
        findGreatestProbAttack();
      }
    }
    // Else if coords returned, use those for attack
    else if (coords) {
      attackCoords = coords;
    }
  }
  // Send attack to game manager
  gm.aiAttacking(attackCoords, delay);
};

export default aiAttack;
