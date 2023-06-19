// This helper will look at current hits and misses and then return an attack
const aiAttack = (gm) => {
  const gridHeight = 10;
  const gridWidth = 10;
  let attackCoords = [];

  // Method for returning random attack
  const randomAttack = () => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    attackCoords = [x, y];
  };

  // Try a random attack that has not been yet tried
  randomAttack();
  console.log(gm);
  while (gm.userBoard.alreadyAttacked(attackCoords)) {
    console.log(attackCoords);
    randomAttack();
  }

  // Send attack to game manager
  gm.aiAttacking(attackCoords);
};

export default aiAttack;
