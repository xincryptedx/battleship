// This helper will look at current hits and misses and then return an attack
const aiAttack = (rivalBoard) => {
  const gridHeight = 10;
  const gridWidth = 10;
  const { hits, misses } = rivalBoard;

  // Method for returning random attack
  const x = Math.floor(Math.random() * gridWidth);
  const y = Math.floor(Math.random() * gridHeight);
};
