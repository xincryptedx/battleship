import gameLog from "../modules/gameLog";

// This helper will look at current hits and misses and then return an attack
const aiAttack = (rivalBoard) => {
  const gridHeight = 10;
  const gridWidth = 10;
  const board = rivalBoard;
  const { hits, misses } = rivalBoard;
  let attackCoords = [];

  // Method to determine if cell has a hit or miss in it
  const alreadyAttacked = (cellCoordinates) => {
    let attacked = false;

    hits.forEach((hit) => {
      if (cellCoordinates[0] === hit[0] && cellCoordinates[1] === hit[1]) {
        attacked = true;
      }
    });

    misses.forEach((miss) => {
      if (cellCoordinates[0] === miss[0] && cellCoordinates[1] === miss[1]) {
        attacked = true;
      }
    });

    return attacked;
  };

  // Method for returning random attack
  const randomAttack = () => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Try a random attack that has not been yet tried
  randomAttack();
  while (alreadyAttacked(attackCoords)) {
    randomAttack();
  }

  // Timeout to simulate "thinking" and to make game feel better
  setTimeout(() => {
    // Send attack to rival board
    rivalBoard
      .receiveAttack(attackCoords)
      // Then draw hits or misses
      .then((result) => {
        if (result === true) {
          // Draw the hit to board
          rivalBoard.canvas.drawHit(attackCoords);
          // Log the hit
          gameLog.append(`AI attacks cell: ${attackCoords}\nAttack hit!`);
          // Log sunk user ships
          rivalBoard.logSunk();
          // Check if AI won
          if (rivalBoard.allSunk()) {
            // Log results
            gameLog.append(
              "All User units destroyed. \nAI dominance is assured."
            );
            // Set game over on boards
            board.gameOver = true;
            board.rivalBoard.gameOver = true;
          }
        } else if (result === false) {
          // Draw the miss to board
          rivalBoard.canvas.drawMiss(attackCoords);
          // Log the miss
          gameLog.append(`AI attacks cell: ${attackCoords}\nAttack missed!`);
        }
      });

    board.canAttack = true;
  }, 10);
};

export default aiAttack;
