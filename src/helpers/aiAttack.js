// This helper will look at current hits and misses and then return an attack
const aiAttack = (rivalBoard) => {
  const gridHeight = 10;
  const gridWidth = 10;
  const { hits, misses } = rivalBoard;
  let attackCoords = [];

  // Method to determine if cell has a hit or miss in it
  const alreadyAttacked = (cellCoordinates) => {
    let attacked = false;

    console.log("Hits:", hits);
    console.log("Misses:", misses);

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

  console.log("Attacking User: ", attackCoords);
  // Send attack to rival board
  rivalBoard
    .receiveAttack(attackCoords)
    // Then draw hits or misses
    .then((result) => {
      if (result === true) {
        rivalBoard.canvas.drawHit(attackCoords);
      } else if (result === false) {
        rivalBoard.canvas.drawMiss(attackCoords);
      }
    });
};

export default aiAttack;
