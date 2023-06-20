import sounds from "./sounds";
import gameLog from "./gameLog";

// Initialize modules
const soundPlayer = sounds();

/* This module allows the various other game modules to communicate and offers
   high level methods to handle various game events. This object will be passed
   to other modules as prop so they can use these methods. */
const gameManager = () => {
  // Refs to relevant game objects
  let userBoard = null;
  let aiBoard = null;
  let userCanvasContainer = null;
  let aiCanvasContainer = null;
  let placementCanvasContainer = null;

  // #region Handle AI Attacks
  // AI Attack Hit
  const aiAttackHit = (attackCoords) => {
    // Play hit sound
    soundPlayer.playHit();
    // Draw the hit to board
    userCanvasContainer.drawHit(attackCoords); // user canvas
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
    userCanvasContainer.drawMiss(attackCoords);
    // Log the miss
    gameLog.erase();
    gameLog.append(`AI attacks cell: ${attackCoords}\nAttack missed!`);
    gameLog.setScene();
  };

  // AI is attacking
  const aiAttacking = (attackCoords) => {
    // Timeout to simulate "thinking" and to make game feel better
    setTimeout(() => {
      // Send attack to rival board
      userBoard
        .receiveAttack(attackCoords)
        // Then draw hits or misses
        .then((result) => {
          if (result === true) {
            aiAttackHit(attackCoords);
          } else if (result === false) {
            aiAttackMissed(attackCoords);
          }
        });

      userBoard.canAttack = true;
    }, 2500);
  };

  // #endregion

  // #region Handle Player Attacks
  const playerAttacking = (attackCoords) => {
    // Return if gameboard can't attack
    if (aiBoard.rivalBoard.canAttack === false) return;
    // Try attack at current cell
    if (aiBoard.alreadyAttacked(attackCoords)) {
      // Bad thing. Error sound maybe.
    } else if (userBoard.gameOver === false) {
      // Set gameboard to not be able to attack
      userBoard.canAttack = false;
      // Log the sent attack
      gameLog.erase();
      gameLog.append(`User attacks cell: ${attackCoords}`);
      gameLog.setScene();
      // Play the sound
      soundPlayer.playAttack();
      // Send the attack
      aiBoard.receiveAttack(attackCoords).then((result) => {
        // Set a timeout for dramatic effect
        setTimeout(() => {
          // Attack hit
          if (result === true) {
            // Play sound
            soundPlayer.playHit();
            // Draw hit to board
            aiCanvasContainer.drawHitMiss(attackCoords, 1);
            // Log hit
            gameLog.append("Attack hit!");
            // Log sunken ships
            aiBoard.logSunk();
            // Check if player won
            if (aiBoard.allSunk()) {
              // Log results
              gameLog.append(
                "All AI units destroyed. \nHumanity survives another day..."
              );
              // Set gameover on boards
              aiBoard.gameOver = true;
              aiBoard.rivalBoard.gameOver = true;
            } else {
              // Log the ai "thinking" about its attack
              gameLog.append("AI detrmining attack...");
              // Have the ai attack if not gameOver
              aiBoard.tryAiAttack();
            }
          } else if (result === false) {
            // Play sound
            soundPlayer.playMiss();
            // Draw miss to board
            aiCanvasContainer.drawHitMiss(attackCoords, 0);
            // Log miss
            gameLog.append("Attack missed!");
            // Log the ai "thinking" about its attack
            gameLog.append("AI detrmining attack...");
            // Have the ai attack if not gameOver
            aiBoard.tryAiAttack();
          }
        }, 1000);
      });
    }
  };

  // #endregion

  // #region Handle Ship Placement

  // #endregion

  return {
    aiAttacking,
    playerAttacking,
    get userBoard() {
      return userBoard;
    },
    set userBoard(board) {
      userBoard = board;
    },
    get aiBoard() {
      return aiBoard;
    },
    set aiBoard(board) {
      aiBoard = board;
    },
    get userCanvasContainer() {
      return userCanvasContainer;
    },
    set userCanvasContainer(canvas) {
      userCanvasContainer = canvas;
    },
    get aiCanvasContainer() {
      return aiCanvasContainer;
    },
    set aiCanvasContainer(canvas) {
      aiCanvasContainer = canvas;
    },
    get placementCanvascontainer() {
      return placementCanvasContainer;
    },
    set placementCanvasContainer(canvas) {
      placementCanvasContainer = canvas;
    },
  };
};

export default gameManager;
