import sounds from "./sounds";
import gameLog from "./gameLog";

// Initialize modules
const soundPlayer = sounds();

/* This module allows the various other game modules to communicate and offers
   high level methods to handle various game events. This object will be passed
   to other modules as prop so they can use these methods. */
const gameManager = (userGameboard, aiGameboard, userCanvas, aiCanvas) => {
  // Refs to relevant game objects
  const userBoard = userGameboard;
  const aiBoard = aiGameboard;

  // AI Attack Hit
  const aiAttackHit = (attackCoords) => {
    // Play hit sound
    soundPlayer.playHit();
    // Draw the hit to board
    userCanvas.drawHit(attackCoords); // user canvas
    // Log sunk user ships
    userBoard.logSunk(); // user board
    // Check if AI won
    if (userBoard.allSunk()) {
      // '        '
      // Log results
      gameLog.append("All User units destroyed. \nAI dominance is assured.");
      // Set game over on boards
      aiBoard.gameOver = true; // AI board
      userBoard.gameOver = true; // User board
    }
  };

  // AI Attack Missed
  const aiAttackMissed = (attackCoords) => {
    // Play sound
    soundPlayer.playMiss();
    // Draw the miss to board
    userCanvas.drawMiss(attackCoords);
    // Log the miss
    gameLog.erase();
    gameLog.append(`AI attacks cell: ${attackCoords}\nAttack missed!`);
    gameLog.setScene();
  };

  return { aiAttackHit, aiAttackMissed };
};

export default gameManager;
