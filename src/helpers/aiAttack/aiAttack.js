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
  const findRandomAttack = () => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Method that finds largest value in 2d array
  const findGreatestProbAttack = () => {
    const { board } = probs;
    let max = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board[i].length; j += 1) {
        if (board[i][j] > max) {
          max = board[i][j];
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

  // Do an attack based on probabilities if ai difficulty is 2
  else if (gm.aiDifficulty === 2) {
    findGreatestProbAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findGreatestProbAttack();
    }
  }

  // Send attack to game manager
  gm.aiAttacking(attackCoords, delay);
};

export default aiAttack;
