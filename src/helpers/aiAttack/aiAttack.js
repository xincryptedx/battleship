/* This module is used to determine what cells the AI should attack. It chooses attack 
  startegies based on the ai difficulty setting on the gameManager. After attack coords
  are found they are sent off to the gameManager to handle the aiAttacking logic for the
  rest of the program. */

import aiBrain from "./aiBrain";

// Module that allows ai to make attacks based on probability and heuristics
const brain = aiBrain();

// This helper will look at current hits and misses and then return an attack
const aiAttack = (gm, delay) => {
  const gridHeight = 10;
  const gridWidth = 10;
  let attackCoords = [];

  // Update cell hit probabilities
  brain.updateProbs(gm);

  // Method for returning random attack
  const findRandomAttack = () => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Method that finds largest value in 2d array
  const findGreatestProbAttack = () => {
    const allProbs = brain.probs;
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
  else if (gm.aiDifficulty === 2 && gm.aiBoard.isAiSeeking) {
    // First ensure that empty cells are set to their initialized probs when seeking
    brain.resetHitAdjacentIncreases();
    // Then find the best attack
    findGreatestProbAttack();
    while (gm.userBoard.alreadyAttacked(attackCoords)) {
      findGreatestProbAttack();
    }
  }

  // Do an attack based on destroy behavior after a hit is found
  else if (gm.aiDifficulty === 2 && !gm.aiBoard.isAiSeeking) {
    // Get coords using destroy method
    const coords = brain.destroyModeCoords(gm);
    // If no coords are returned instead use seeking strat
    if (!coords) {
      // First ensure that empty cells are set to their initialized probs when seeking
      brain.resetHitAdjacentIncreases();
      // Then find the best attack
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
