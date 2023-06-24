import randomShips from "../helpers/randomShips";

/* This module allows the various other game modules to communicate and offers
   high level methods to handle various game events. This object will be passed
   to other modules as prop so they can use these methods. */
const gameManager = () => {
  // Game settings
  let aiDifficulty = 2;

  // Refs to relevant game objects
  let userBoard = null;
  let aiBoard = null;
  let userCanvasContainer = null;
  let aiCanvasContainer = null;
  let placementCanvasContainer = null;

  // Refs to modules
  let soundPlayer = null;
  let webInterface = null;
  let gameLog = null;

  // #region Handle AI Attacks
  // AI Attack Hit
  const aiAttackHit = (attackCoords) => {
    // Play hit sound
    soundPlayer.playHit();
    // Draw the hit to board
    userCanvasContainer.drawHit(attackCoords);
    // Log the hit
    gameLog.erase();
    gameLog.append(
      `AI attacks cell: ${attackCoords} \nAttack hit your ${userBoard.hitShipType}!`
    );
    gameLog.setScene();
    // Set ai to destroy mode
    aiBoard.isAiSeeking = false;
    console.log("AI Destroying!");
    // Add hit to cells to check
    aiBoard.cellsToCheck.push(attackCoords);
    // Log sunk user ships
    const sunkMsg = userBoard.logSunk();
    if (sunkMsg !== null) {
      gameLog.append(sunkMsg);
      // Update log scene
      gameLog.setScene();
    }
    userBoard.logSunk();
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
  let aiAttackCount = 0;
  const aiAttacking = (attackCoords, delay = 2500) => {
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

          // Break out of recursion if game is over
          if (userBoard.gameOver === true) {
            gameLog.erase();
            gameLog.append(`Total AI attacks: ${aiAttackCount}`);
            gameLog.doLock = true;
            return;
          }

          // If user board is AI controlled have it try an attack
          if (aiBoard.isAutoAttacking === true) {
            aiAttackCount += 1;
            aiBoard.tryAiAttack(250);
          }
          // Otherwise allow the user to attack again
          else {
            userBoard.canAttack = true;
          }
        });
    }, delay);
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
            aiCanvasContainer.drawHit(attackCoords);
            // Log hit
            gameLog.append("Attack hit!");
            // Log sunken ships
            const sunkMsg = aiBoard.logSunk();
            if (sunkMsg !== null) {
              gameLog.append(sunkMsg);
              // Update log scene
              gameLog.setScene();
            }

            // Check if player won
            if (aiBoard.allSunk()) {
              // Log results
              gameLog.append(
                "All AI units destroyed. \nHumanity survives another day..."
              );
              // Set gameover on boards
              aiBoard.gameOver = true;
              userBoard.gameOver = true;
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
            aiCanvasContainer.drawMiss(attackCoords);
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

  // Handle setting up an AI vs AI match
  const aiMatchClicked = () => {
    // Set ai to auto attack
    aiBoard.isAutoAttacking = true;
    // Set game log to not update scene
    gameLog.doUpdateScene = false;
    // Set the sounds to muted
    soundPlayer.isMuted = soundPlayer.isMuted !== true;
  };

  // #region Handle Ship Placement and Game Start
  // Check if game should start after placement
  const tryStartGame = () => {
    if (userBoard.ships.length === 5) {
      webInterface.showGame();
    }
  };

  // Handle random ships button click
  const randomShipsClicked = () => {
    randomShips(userBoard, userBoard.maxBoardX, userBoard.maxBoardY);
    userCanvasContainer.drawShips();
    tryStartGame();
  };

  // Handle rotate button clicks
  const rotateClicked = () => {
    userBoard.direction = userBoard.direction === 0 ? 1 : 0;
    aiBoard.direction = aiBoard.direction === 0 ? 1 : 0;
  };

  const placementClicked = (cell) => {
    // Try placement
    userBoard.addShip(cell);
    placementCanvasContainer.drawShips();
    userCanvasContainer.drawShips();
    tryStartGame();
  };
  // #endregion

  // When a user ship is sunk
  const userShipSunk = (ship) => {
    // Remove the sunken ship cells from cells to check
    console.log("Cells before removal logic:");
    console.log(JSON.stringify(aiBoard.cellsToCheck));
    ship.occupiedCells.forEach((cell) => {
      // Occupied cell x and y
      const [ox, oy] = cell;
      // Remove it from cells to check if it exists
      for (let i = 0; i < aiBoard.cellsToCheck.length; i += 1) {
        // Cell to check x and y
        const [cx, cy] = aiBoard.cellsToCheck[i];
        // Remove if match found
        if (ox === cx && oy === cy) {
          aiBoard.cellsToCheck.splice(i, 1);
        }
      }
    });

    // If cells to check is empty then stop destory mode
    if (aiBoard.cellsToCheck.length === 0) aiBoard.isAiSeeking = true;
    console.log("AI Seeking...");

    // Clear relevant cells from check queue in cellProbs
    console.log(
      `Ship cells that should be gone: `,
      JSON.stringify(ship.occupiedCells)
    );
    console.log(`Cells to check:`, JSON.stringify(aiBoard.cellsToCheck));
  };

  return {
    aiAttacking,
    playerAttacking,
    aiMatchClicked,
    placementClicked,
    randomShipsClicked,
    rotateClicked,
    userShipSunk,
    get aiDifficulty() {
      return aiDifficulty;
    },
    set aiDifficulty(diff) {
      if (diff === 1 || diff === 2 || diff === 3) aiDifficulty = diff;
    },
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
    get soundPlayer() {
      return soundPlayer;
    },
    set soundPlayer(aModule) {
      soundPlayer = aModule;
    },
    get webInterface() {
      return webInterface;
    },
    set webInterface(aModule) {
      webInterface = aModule;
    },
    get gameLog() {
      return gameLog;
    },
    set gameLog(aModule) {
      gameLog = aModule;
    },
  };
};

export default gameManager;
